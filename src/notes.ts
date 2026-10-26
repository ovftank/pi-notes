import { createHash } from "node:crypto";
import { appendFileSync, mkdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const notesDir = (home: string): string => join(home, "notes");

const key = (cwd: string): string => createHash("sha1").update(cwd.toLowerCase()).digest("hex").slice(0, 10);

const notePath = (home: string, cwd: string): string => join(notesDir(home), `${key(cwd)}.md`);

function countNotes(path: string): number {
	try {
		return readFileSync(path, "utf8").split("\n").filter((l) => l.startsWith("- [")).length;
	} catch {
		return 0;
	}
}

function addNote(home: string, cwd: string, text: string, kind = "finding"): { path: string; notes: number } {
	const path = notePath(home, cwd);
	const body = text
		.trim()
		.split(/\r?\n/)
		.filter(Boolean)
		.map((line, i) => (i === 0 ? `- [${kind}] ${line}` : `  ${line}`))
		.join("\n");
	mkdirSync(notesDir(home), { recursive: true });
	appendFileSync(path, `${body}\n`);
	return { path, notes: countNotes(path) };
}

function readNotes(home: string, cwd: string): { path: string; notes: number; text: string } | undefined {
	const path = notePath(home, cwd);
	try {
		const text = readFileSync(path, "utf8");
		return { path, notes: countNotes(path), text };
	} catch {
		return undefined;
	}
}

export { addNote, readNotes };
