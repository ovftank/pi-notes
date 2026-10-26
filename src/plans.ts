import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const plansDir = ( home: string ): string => join( home, ".notes" );

type Question = { q: string; a?: string; };
type State = { goal?: string; questions: Question[]; savedGoal?: string; savedHash?: string; };

function planKey ( cwd: string ): string
{
	return createHash( "sha1" ).update( cwd.toLowerCase() ).digest( "hex" ).slice( 0, 10 );
}

function planPath ( home: string, cwd: string ): string
{
	return join( plansDir( home ), `${ planKey( cwd ) }.md` );
}

function statePath ( home: string, cwd: string ): string
{
	return join( plansDir( home ), `${ planKey( cwd ) }.state.json` );
}

function readState ( home: string, cwd: string ): State
{
	try
	{
		const parsed = JSON.parse( readFileSync( statePath( home, cwd ), "utf8" ) ) as State;
		return {
			goal: parsed.goal,
			questions: Array.isArray( parsed.questions ) ? parsed.questions : [],
			savedGoal: parsed.savedGoal,
			savedHash: parsed.savedHash,
		};
	} catch
	{
		return { questions: [] };
	}
}

function writeState ( home: string, cwd: string, state: State ): void
{
	mkdirSync( plansDir( home ), { recursive: true } );
	const path = statePath( home, cwd );
	const tmp = `${ path }.${ process.pid }.tmp`;
	writeFileSync( tmp, `${ JSON.stringify( state, null, 2 ) }\n` );
	renameSync( tmp, path );
}

const openCount = ( state: State ): number => state.questions.filter( ( q ) => !q.a ).length;

const sha1 = ( text: string ): string => createHash( "sha1" ).update( text ).digest( "hex" );

function ask ( home: string, cwd: string, questions: string[] ): { open: number; questions: Question[]; }
{
	const state = readState( home, cwd );
	for ( const q of questions )
	{
		const text = q.trim();
		if ( text ) state.questions.push( { q: text } );
	}
	writeState( home, cwd, state );
	return { open: openCount( state ), questions: state.questions };
}

function answer ( home: string, cwd: string, answers: string[] ): { open: number; questions: Question[]; }
{
	const state = readState( home, cwd );
	const open = state.questions.filter( ( q ) => !q.a );
	if ( open.length === 0 ) throw new Error( "no open questions to answer" );
	answers.forEach( ( a, i ) =>
	{
		const target = open[ i ];
		if ( target ) target.a = a.trim();
	} );
	writeState( home, cwd, state );
	return { open: openCount( state ), questions: state.questions };
}

function setGoal ( home: string, cwd: string, goal: string ): { goal: string; open: number; }
{
	const state = readState( home, cwd );
	const open = openCount( state );
	if ( open > 0 ) throw new Error( `${ open } open question${ open === 1 ? "" : "s" } — answer them before setting the goal` );
	const text = goal.trim();
	if ( !text ) throw new Error( "goal needs text" );
	state.goal = text;
	writeState( home, cwd, state );
	return { goal: text, open: 0 };
}

function savePlan ( home: string, cwd: string, text: string ): { path: string; goal: string; overwrote: boolean; }
{
	const state = readState( home, cwd );
	if ( !state.goal ) throw new Error( 'no goal set — plan(action: "goal") first' );
	const open = openCount( state );
	if ( open > 0 ) throw new Error( `${ open } open question${ open === 1 ? "" : "s" } — answer them before saving the plan` );
	mkdirSync( plansDir( home ), { recursive: true } );
	const path = planPath( home, cwd );
	const body = text.trimEnd() + "\n";
	let overwrote = false;
	if ( state.savedHash )
	{
		try
		{
			if ( sha1( readFileSync( path, "utf8" ) ) !== state.savedHash ) overwrote = true;
		} catch
		{
		}
	}
	const tmp = `${ path }.${ process.pid }.tmp`;
	writeFileSync( tmp, body );
	renameSync( tmp, path );
	writeState( home, cwd, { ...state, savedGoal: state.goal, savedHash: sha1( body ) } );
	return { path, goal: state.goal, overwrote };
}

function readPlan (
	home: string,
	cwd: string,
):
	{
		path: string;
		goal: string | null;
		open: number;
		questions: Question[];
		text: string;
		edited: boolean;
		stale: boolean;
	} | undefined
{
	const path = planPath( home, cwd );
	let text: string;
	try
	{
		text = readFileSync( path, "utf8" );
	} catch
	{
		return undefined;
	}
	const state = readState( home, cwd );
	return {
		path,
		goal: state.goal ?? null,
		open: openCount( state ),
		questions: state.questions,
		text,
		edited: state.savedHash !== undefined && sha1( text ) !== state.savedHash,
		stale: state.savedGoal !== undefined && state.savedGoal !== state.goal,
	};
}

export { answer, ask, openCount, readPlan, readState, savePlan, setGoal };
