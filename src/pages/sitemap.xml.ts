import { SITE_URL } from "../lib/site";

// The two language versions of the home page, each naming the other.
export function GET(): Response {
  const pages = ["/", "/ko/"];
  const alternates = pages.map((path, at) => `<xhtml:link rel="alternate" hreflang="${at === 0 ? "en" : "ko"}" href="${SITE_URL}${path}"/>`).join("");
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${pages.map((path) => `<url><loc>${SITE_URL}${path}</loc>${alternates}</url>`).join("\n")}
</urlset>
`;

  return new Response(body, { headers: { "content-type": "application/xml" } });
}
