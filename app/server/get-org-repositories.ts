import { Octokit } from "octokit";
import { getAccessToken } from "~/lib/session";

export async function getOrgRepositories(request: Request) {
  const { GITHUB_ORG } = process.env;
  if (!GITHUB_ORG) throw new Error("No GITHUB_ORG.");

  const accessToken = await getAccessToken(request);

  const q = ["org:3sidedcube"];
  const url = new URL(request.url);
  const query = url.searchParams.get("query");
  if (query) q.push(`${query} in:name`);

  const octokit = new Octokit({ auth: accessToken });
  const response = await octokit.request("GET /search/repositories", {
    headers: { "X-GitHub-Api-Version": "2022-11-28" },
    q: q.join(" "),
    sort: !query ? "updated" : undefined,
  });
  return response.data.items;
}
