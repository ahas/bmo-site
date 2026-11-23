import { LOCALES, messagesFor } from "../i18n";
import { SITE_URL } from "../lib/site";

// The home page in every language, each entry naming all of them.
export function GET(): Response {
  const pages = LOCALES.map((entry) => ({ hreflang: messagesFor(entry.code).htmlLang, href: `${SITE_URL}${messagesFor(entry.code).path}` }));
  const alternates = pages.map((page) => `<xhtml:link rel="alternate" hreflang="${page.hreflang}" href="${page.href}"/>`).join("");
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${pages.map((page) => `<url><loc>${page.href}</loc>${alternates}<xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL}/"/></url>`).join("\n")}
</urlset>
`;

  return new Response(body, { headers: { "content-type": "application/xml" } });
}
