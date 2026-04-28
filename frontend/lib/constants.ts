export const GITHUB_APP_NAME =
  process.env.NEXT_PUBLIC_GITHUB_APP_NAME || "codexa";

export const INSTALL_URL = `https://github.com/apps/${GITHUB_APP_NAME}/installations/new`;

// Public source repo — used by navbar / footer GitHub links.
export const GITHUB_REPO_URL =
  process.env.NEXT_PUBLIC_GITHUB_REPO_URL || "https://github.com/techyMk/codexa";
