import { defineConfig } from "astro/config";

// A static site: every page is written to dist/ at build time and nothing runs on a server.
// English stands at the root, Korean under /ko/, Japanese under /ja/ and Simplified Chinese under /zh/.
export default defineConfig({
  site: "https://bmo.ahas.io",
  output: "static",
  trailingSlash: "ignore",
  build: { format: "directory" },
  compressHTML: true,
  i18n: {
    defaultLocale: "en",
    locales: ["en", "ko", "ja", "zh"],
    routing: { prefixDefaultLocale: false },
  },
});
