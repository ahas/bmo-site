import { getCollection } from "astro:content";

import type { CollectionEntry } from "astro:content";
import type { Locale } from "../i18n";

// The guidebook's chapters in a language, in their order. A chapter's entry id is `<language>/<chapter>`, and the
// chapter's name, the part after the language, is its address under /guide/ in every language.

export type Chapter = CollectionEntry<"guide"> & { slug: string };

export async function chapters(locale: Locale): Promise<Chapter[]> {
  const entries = await getCollection("guide", (entry) => entry.id.startsWith(`${locale}/`));

  return entries.map((entry) => ({ ...entry, slug: entry.id.slice(locale.length + 1) })).sort((a, b) => a.data.order - b.data.order);
}
