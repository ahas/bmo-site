import { runbook } from "../lib/runbook";

// The install runbook at /install.md, the one address the get-started section hands a coding agent.
export async function GET(): Promise<Response> {
  return new Response(await runbook(), { headers: { "content-type": "text/markdown; charset=utf-8" } });
}
