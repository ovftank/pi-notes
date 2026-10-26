import { join } from "node:path";

import { Type } from "@earendil-works/pi-ai";
import { defineTool } from "@earendil-works/pi-coding-agent";
import type { ExtensionAPI, ExtensionContext } from "@earendil-works/pi-coding-agent";
import { readPlan, savePlan, setGoal, answer, ask } from "#src/plans.ts";
import { addNote, readNotes } from "#src/notes.ts";

const home = (cwd: string) => join(cwd, ".pi-notes");

function out(data: unknown, details?: unknown) {
	let text: string;
	if (typeof data === "string") text = data;
	else text = JSON.stringify(data, null, 2);
	return { content: [{ type: "text" as const, text }], details };
}

type AppendEntry = (customType: string, data: unknown) => void;

function record(ctx: ExtensionContext, kind: string, data: unknown): void {
	const append = (ctx as unknown as { appendEntry?: AppendEntry }).appendEntry;
	if (typeof append !== "function") return;
	try {
		append.call(ctx, "pi-notes", { kind, at: Date.now(), data });
	} catch {
	}
}

function extension(pi: ExtensionAPI) {
	pi.registerTool(
		defineTool({
			name: "plan",
			label: "plan",
			description:
				"Plan gate for this workspace. ask (record what is still unclear) → answer (the user's answers, in order) → goal (refused while a question is open) → save (refused until a goal exists). read returns the saved plan and the notebook; it also reports edited (someone changed the plan by hand) and stale (the plan belongs to an earlier goal). Everything lives in .pi-notes/ under the working directory, so the plan survives a context reset.",
			promptSnippet: "Ask, answer, set the goal, save or read the plan",
			annotations: { readOnlyHint: false, destructiveHint: false, openWorldHint: false },
			parameters: Type.Object({
				action: Type.Union([
					Type.Literal("ask"),
					Type.Literal("answer"),
					Type.Literal("goal"),
					Type.Literal("save"),
					Type.Literal("read"),
				]),
				questions: Type.Optional(Type.Array(Type.String({ description: "for ask: what only the user can decide" }))),
				answers: Type.Optional(Type.Array(Type.String({ description: "for answer: one answer per open question, in order" }))),
				goal: Type.Optional(Type.String({ description: "for goal: the outcome wanted, one paragraph" })),
				text: Type.Optional(Type.String({ description: "for save: the complete markdown plan" })),
			}),
			execute(_id, params, _signal, _onUpdate, ctx: ExtensionContext) {
				const dir = home(ctx.cwd);
				switch (params.action) {
					case "ask": {
						if (!params.questions?.length) throw new Error("ask needs questions");
						const r = ask(dir, ctx.cwd, params.questions);
						record(ctx, "plan.ask", r);
						return Promise.resolve(out(r, r));
					}
					case "answer": {
						if (!params.answers?.length) throw new Error("answer needs answers");
						const r = answer(dir, ctx.cwd, params.answers);
						record(ctx, "plan.answer", r);
						return Promise.resolve(out(r, r));
					}
					case "goal": {
						if (!params.goal?.trim()) throw new Error("goal needs text");
						const r = setGoal(dir, ctx.cwd, params.goal);
						record(ctx, "plan.goal", r);
						return Promise.resolve(out(r, r));
					}
					case "save": {
						if (!params.text?.trim()) throw new Error("save needs the plan text");
						const r = savePlan(dir, ctx.cwd, params.text);
						record(ctx, "plan.save", r);
						return Promise.resolve(out(r, r));
					}
					case "read":
						return Promise.resolve(
							out({
								...(readPlan(dir, ctx.cwd) ?? { missing: true }),
								notes: readNotes(dir, ctx.cwd) ?? { missing: true },
							}),
						);
				}
			},
		}),
	);

	pi.registerTool(
		defineTool({
			name: "note",
			label: "note",
			description:
				"Write one finding to the notebook and return only { path, notes }. The point is that the fact leaves the context without being lost: a path that exists, an endpoint that answers, a decision that rules something out. Append-only — read it back with plan read. Say whether you saw it or only infer it.",
			promptSnippet: "Write one finding to the notebook",
			annotations: { readOnlyHint: false, destructiveHint: false, openWorldHint: false },
			parameters: Type.Object({
				text: Type.String({ description: "the finding, as short as it can be while staying checkable" }),
				kind: Type.Optional(
					Type.String({ description: "what kind of fact: observed, inferred, decision, dead-end, question" }),
				),
			}),
			execute(_id, params, _signal, _onUpdate, ctx: ExtensionContext) {
				const r = addNote(home(ctx.cwd), ctx.cwd, params.text, params.kind);
				record(ctx, "note.add", r);
				return Promise.resolve(out(r, r));
			},
		}),
	);
}

export default extension;
