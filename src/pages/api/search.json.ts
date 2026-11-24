import { apiUnits } from "../../lib/openapi";

// Every public unit's endpoints in one list for the API reference's search, which the index page reads when a reader
// first types into it: the unit, the method, the path, the summary and the operation's anchor on the unit's page.
export async function GET(): Promise<Response> {
  const units = await apiUnits();
  const endpoints = units.flatMap((unit) =>
    unit.groups.flatMap((group) => group.operations.map((operation) => ({ unit: unit.slug, method: operation.method, path: operation.path, summary: operation.summary ?? "", anchor: operation.anchor })))
  );

  return new Response(JSON.stringify(endpoints), { headers: { "content-type": "application/json" } });
}
