// Addresses the site links to. Every repository is linked by its name under the GitHub owner.
export const SITE_URL = "https://bmo.ahas.io";
export const GITHUB_OWNER_URL = "https://github.com/ahas";
export const UMBRELLA_URL = `${GITHUB_OWNER_URL}/bmo`;
export const STRUCTURE_URL = `${UMBRELLA_URL}/blob/main/STRUCTURE.md`;
export const LICENSE_URL = `${GITHUB_OWNER_URL}/bmo-site/blob/main/LICENSE`;
export const DESKTOP_DOC_URL = `${GITHUB_OWNER_URL}/jake/blob/main/docs/desktop.md`;

export function repositoryUrl(name: string): string {
  return `${GITHUB_OWNER_URL}/${name}`;
}
