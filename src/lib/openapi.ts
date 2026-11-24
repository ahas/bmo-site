import SwaggerParser from "@apidevtools/swagger-parser";
import { Marked } from "marked";

import { REPOSITORY_GROUPS } from "./repositories";

import type { Repository } from "./repositories";

// The API reference's reading of each public unit's OpenAPI document. The documents stand under src/data/openapi/ as
// the snapshot scripts/openapi/refresh.ts writes from each unit's main branch; Swagger Parser resolves every reference
// in them, and this module turns each resolved document into what the reference pages show: the operations grouped by
// tag, their parameters, bodies, responses and error codes, and the named schemas they use. A schema the document names
// under its components is shown once, in the page's schema list, and every use of it links there.

const SNAPSHOTS = import.meta.glob<Record<string, unknown>>("../data/openapi/bmo-*.json", { eager: true, import: "default" });

const METHODS = ["get", "post", "put", "patch", "delete", "head", "options", "trace"] as const;

/** How deep an unnamed nested object is laid out under a field before it is shown by its type alone. */
const NESTING = 3;

type Json = Record<string, unknown>;

/** One piece of a type's label, linking to a named schema where it is one. */
export interface TypePart {
  text: string;
  schema?: string;
}

/** One field of an object schema, with the fields of an unnamed object nested under it. */
export interface Field {
  name: string;
  required: boolean;
  type: TypePart[];
  description?: string;
  values?: string[];
  fallback?: string;
  fields: Field[];
}

export interface Parameter {
  name: string;
  in: string;
  required: boolean;
  type: TypePart[];
  description?: string;
}

export interface Body {
  mediaType: string;
  type: TypePart[];
  fields: Field[];
}

export interface Answer {
  status: string;
  description?: string;
  bodies: Body[];
}

export interface Operation {
  anchor: string;
  method: string;
  path: string;
  summary?: string;
  description?: string;
  deprecated: boolean;
  secured: boolean;
  parameters: Parameter[];
  request?: { required: boolean; description?: string; bodies: Body[] };
  answers: Answer[];
  codes: string[];
}

export interface TagGroup {
  /** The tag's name, or "" for the operations no tag holds. */
  name: string;
  anchor: string;
  description?: string;
  operations: Operation[];
}

export interface NamedSchema {
  name: string;
  anchor: string;
  type: TypePart[];
  description?: string;
  values?: string[];
  fields: Field[];
}

export interface ApiUnit {
  repository: Repository;
  slug: string;
  title: string;
  version: string;
  openapi: string;
  description?: string;
  servers: { url: string; description?: string }[];
  security: { name: string; text: string }[];
  groups: TagGroup[];
  schemas: NamedSchema[];
  operationCount: number;
}

// Descriptions are Markdown; raw HTML inside one is shown as text, never taken as markup.
const markdown = new Marked({
  gfm: true,
  renderer: {
    html: ({ text }) => escapeHtml(text),
  },
});

function escapeHtml(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

/** A description's Markdown as HTML. */
export function prose(text: string | undefined): string {
  return text ? (markdown.parse(text, { async: false }) as string) : "";
}

/** A one-line summary's Markdown as inline HTML. */
export function inline(text: string | undefined): string {
  return text ? (markdown.parseInline(text, { async: false }) as string) : "";
}

function slug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function text(value: unknown): string | undefined {
  return typeof value === "string" && value.trim().length > 0 ? value : undefined;
}

function shown(value: unknown): string {
  return typeof value === "string" ? value : JSON.stringify(value);
}

/** Reads one resolved document's schemas, keeping the component names a reference pointed at. */
class Reader {
  constructor(private readonly names: Map<object, string>) {}

  type(schema: unknown): TypePart[] {
    if (!schema || typeof schema !== "object") return [{ text: "any" }];

    const node = schema as Json;
    const name = this.names.get(node);

    if (name) return [{ text: name, schema: name }];
    if ("const" in node) return [{ text: shown(node.const) }];

    const variants = (node.anyOf ?? node.oneOf) as unknown[] | undefined;

    if (Array.isArray(variants)) return this.joined(variants, " | ");
    if (Array.isArray(node.allOf)) return this.joined(node.allOf as unknown[], " & ");

    const kinds = Array.isArray(node.type) ? (node.type as string[]) : typeof node.type === "string" ? [node.type] : [];
    const labels = kinds.map((kind): TypePart[] => {
      if (kind === "array") return [{ text: "array<" }, ...this.type(node.items), { text: ">" }];
      if (kind === "object" && !node.properties && node.additionalProperties && typeof node.additionalProperties === "object") {
        return [{ text: "map<string, " }, ...this.type(node.additionalProperties), { text: ">" }];
      }
      return [{ text: typeof node.format === "string" && kind !== "null" ? `${kind} (${node.format})` : kind }];
    });

    if (labels.length === 0) return [{ text: node.properties ? "object" : "any" }];

    return labels.flatMap((label, index) => (index === 0 ? label : [{ text: " | " }, ...label]));
  }

  private joined(variants: unknown[], separator: string): TypePart[] {
    return variants.flatMap((variant, index) => (index === 0 ? this.type(variant) : [{ text: separator }, ...this.type(variant)]));
  }

  /** The values an enumeration allows, where the schema is one. */
  values(schema: unknown): string[] | undefined {
    const node = schema as Json | undefined;

    return Array.isArray(node?.enum) ? (node.enum as unknown[]).map(shown) : undefined;
  }

  /** The fields of an object schema, laid out to the nesting bound; a named schema's fields are its own section's. */
  fields(schema: unknown, depth = 0, top = true): Field[] {
    if (!schema || typeof schema !== "object" || depth > NESTING) return [];

    const node = schema as Json;

    if (!top && this.names.has(node)) return [];
    if (Array.isArray(node.allOf)) return (node.allOf as unknown[]).flatMap((member) => this.fields(member, depth, false));
    if (node.type === "array" || (Array.isArray(node.type) && node.type.includes("array"))) return this.fields(node.items, depth, false);

    const variants = (node.anyOf ?? node.oneOf) as unknown[] | undefined;

    if (Array.isArray(variants)) {
      const objects = variants.filter((variant) => variant && typeof variant === "object" && (variant as Json).type !== "null");

      return objects.length === 1 ? this.fields(objects[0], depth, false) : [];
    }

    const properties = (node.properties ?? {}) as Record<string, unknown>;
    const required = new Set(Array.isArray(node.required) ? (node.required as string[]) : []);

    return Object.entries(properties).map(([name, property]) => {
      // A boolean schema (`true`) allows any value and has nothing more to show.
      const field = (property && typeof property === "object" ? property : {}) as Json;

      return {
        name,
        required: required.has(name),
        type: this.type(field),
        description: text(field.description),
        values: this.values(field),
        fallback: "default" in field ? shown(field.default) : undefined,
        fields: this.fields(field, depth + 1, false),
      };
    });
  }
}

function securityText(scheme: Json): string {
  if (scheme.type === "http") return `HTTP ${String(scheme.scheme ?? "")}${scheme.bearerFormat ? ` (${String(scheme.bearerFormat)})` : ""}`.trim();
  if (scheme.type === "apiKey") return `API key in ${String(scheme.in)} ${String(scheme.name)}`;
  return String(scheme.type ?? "");
}

function isSecured(requirements: unknown): boolean {
  return Array.isArray(requirements) && requirements.some((requirement) => requirement && Object.keys(requirement as object).length > 0);
}

async function read(repository: Repository, raw: Json): Promise<ApiUnit> {
  const document = (await SwaggerParser.dereference(structuredClone(raw) as never)) as unknown as Json;
  const components = (document.components ?? {}) as Json;
  const schemas = (components.schemas ?? {}) as Record<string, Json>;
  const names = new Map<object, string>(Object.entries(schemas).map(([name, schema]) => [schema, name]));
  const reader = new Reader(names);
  const used = new Set<string>();
  const bodies = (content: unknown): Body[] =>
    Object.entries((content ?? {}) as Record<string, Json>).map(([mediaType, media]) => ({ mediaType, type: reader.type(media.schema), fields: reader.fields(media.schema) }));

  // The tags in the order the document declares them, then in the order its operations first name them.
  const declared = (Array.isArray(document.tags) ? (document.tags as unknown[]) : []).map((tag) =>
    typeof tag === "string" ? { name: tag } : { name: String((tag as Json).name), description: text((tag as Json).description) }
  );
  const groups = new Map<string, TagGroup>(declared.map((tag) => [tag.name, { name: tag.name, anchor: `tag-${slug(tag.name)}`, description: tag.description, operations: [] }]));

  for (const [path, item] of Object.entries((document.paths ?? {}) as Record<string, Json>)) {
    const shared = Array.isArray(item.parameters) ? (item.parameters as Json[]) : [];

    for (const method of METHODS) {
      const operation = item[method] as Json | undefined;

      if (!operation) continue;

      const own = Array.isArray(operation.parameters) ? (operation.parameters as Json[]) : [];
      const parameters = [...shared.filter((one) => !own.some((mine) => mine.name === one.name && mine.in === one.in)), ...own].map((parameter) => ({
        name: String(parameter.name),
        in: String(parameter.in),
        required: parameter.required === true,
        type: reader.type(parameter.schema),
        description: text(parameter.description),
      }));
      const request = operation.requestBody as Json | undefined;
      const tag = Array.isArray(operation.tags) && operation.tags.length > 0 ? String(operation.tags[0]) : "";
      let anchor = `op-${slug(text(operation.operationId) ?? `${method}-${path}`)}`;

      while (used.has(anchor)) anchor += "-";
      used.add(anchor);

      if (!groups.has(tag)) groups.set(tag, { name: tag, anchor: tag ? `tag-${slug(tag)}` : "tag-other", operations: [] });
      groups.get(tag)!.operations.push({
        anchor,
        method,
        path,
        summary: text(operation.summary),
        description: text(operation.description),
        deprecated: operation.deprecated === true,
        secured: isSecured(operation.security ?? document.security),
        parameters,
        request: request ? { required: request.required === true, description: text(request.description), bodies: bodies(request.content) } : undefined,
        answers: Object.entries((operation.responses ?? {}) as Record<string, Json>).map(([status, answer]) => ({
          status,
          description: text(answer.description),
          bodies: bodies(answer.content),
        })),
        codes: Array.isArray(operation["x-codes"]) ? (operation["x-codes"] as unknown[]).map(String) : [],
      });
    }
  }

  const ordered = [...groups.values()].filter((group) => group.operations.length > 0).sort((a, b) => Number(a.name === "") - Number(b.name === ""));
  const info = (document.info ?? {}) as Json;

  return {
    repository,
    slug: repository.name,
    title: text(info.title) ?? repository.name,
    version: String(info.version ?? ""),
    openapi: String(document.openapi ?? ""),
    description: text(info.description),
    servers: (Array.isArray(document.servers) ? (document.servers as Json[]) : []).map((server) => ({ url: String(server.url), description: text(server.description) })),
    security: Object.entries((components.securitySchemes ?? {}) as Record<string, Json>).map(([name, scheme]) => ({ name, text: securityText(scheme) })),
    groups: ordered,
    schemas: Object.entries(schemas)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([name, schema]) => ({
        name,
        anchor: `schema-${slug(name)}`,
        // A copy, so the schema is read for what it is rather than shown by its own name.
        type: reader.type({ ...schema }),
        description: text(schema.description),
        values: reader.values(schema),
        fields: reader.fields(schema),
      })),
    operationCount: ordered.reduce((count, group) => count + group.operations.length, 0),
  };
}

let cached: Promise<ApiUnit[]> | null = null;

/** Every public unit that publishes an OpenAPI document, in the order the site lists repositories. */
export function apiUnits(): Promise<ApiUnit[]> {
  cached ??= Promise.all(
    REPOSITORY_GROUPS.flatMap((group) => group.items)
      .filter((repository) => !repository.retired && SNAPSHOTS[`../data/openapi/${repository.name}.json`])
      .map((repository) => read(repository, SNAPSHOTS[`../data/openapi/${repository.name}.json`]!))
  );

  return cached;
}

/** The anchor of a named schema on its unit's page. */
export function schemaAnchor(name: string): string {
  return `schema-${slug(name)}`;
}
