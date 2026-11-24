import { LOCALES, messagesFor } from "../i18n";
import { chapters } from "../lib/guide";
import { apiUnits } from "../lib/openapi";
import { SITE_URL } from "../lib/site";

// Every page in every language, each entry naming the page's other languages: the home page, the guidebook and its
// chapters, the API reference and its units, and the release notes.
export async function GET(): Promise<Response> {
  const paths = [
    "",
    "guide/",
    ...(await chapters("en")).map((chapter) => `guide/${chapter.slug}/`),
    "api/",
    ...(await apiUnits()).map((unit) => `api/${unit.slug}/`),
    "releases/",
  ];
  const entries = paths.flatMap((path) => {
    const pages = LOCALES.map((entry) => ({ hreflang: messagesFor(entry.code).htmlLang, href: `${SITE_URL}${messagesFor(entry.code).path}${path}` }));
    const alternates = pages.map((page) => `<xhtml:link rel="alternate" hreflang="${page.hreflang}" href="${page.href}"/>`).join("");

    return pages.map((page) => `<url><loc>${page.href}</loc>${alternates}<xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL}/${path}"/></url>`);
  });
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries.join("\n")}
</urlset>
`;

  return new Response(body, { headers: { "content-type": "application/xml" } });
}
