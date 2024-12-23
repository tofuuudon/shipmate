import { Octokit } from "octokit";

export async function getMe(accessToken: string) {
  const octokit = new Octokit({ auth: accessToken });
  return octokit.request("GET /user", {
    headers: { "X-GitHub-Api-Version": "2022-11-28" },
  });
}
