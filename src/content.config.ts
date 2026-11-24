import { existsSync } from "node:fs";

import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

// The guidebook: one Markdown file a chapter in each language, src/content/guide/<language>/<chapter>.md, every
// language holding the same chapters under the same names. Korean is the source the others are translated from.
// A chapter may show screenshots by the name of their captures under src/assets/shots/, each with its words.
const guide = defineCollection({
  loader: glob({ pattern: "*/*.md", base: "./src/content/guide" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    order: z.number().int().positive(),
    shots: z
      .array(
        z.object({
          // Every screen a chapter shows is captured in every language, in both colour schemes.
          name: z
            .string()
            .refine(
              (name) => ["en", "ko", "ja", "zh"].every((language) => ["dark", "light"].every((scheme) => existsSync(`./src/assets/shots/${name}-${language}-${scheme}.webp`))),
              "not captured in every language and scheme under src/assets/shots/"
            ),
          alt: z.string().min(11),
        })
      )
      .default([]),
  }),
});

export const collections = { guide };
