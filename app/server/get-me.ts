import { Octokit } from "octokit";

export async function getMe(accessToken: string) {
  const octokit = new Octokit({ auth: accessToken });
  const response = await octokit.request("GET /user", {
    headers: { "X-GitHub-Api-Version": "2022-11-28" },
  });
  return response.data;
}
