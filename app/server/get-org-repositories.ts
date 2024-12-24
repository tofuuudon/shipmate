import { Octokit } from "octokit";
import { getAccessToken } from "~/lib/session";

export const GET_ORG_REPOSITORIES_LIMIT = 30;

export async function getOrgRepositories(request: Request) {
  const { GITHUB_ORG } = process.env;
  if (!GITHUB_ORG) throw new Error("No GITHUB_ORG.");

  const accessToken = await getAccessToken(request);

  const q = ["org:3sidedcube"];
  const url = new URL(request.url);
  const query = url.searchParams.get("query");
  if (query) q.push(query);

  let page: number;
  try {
    page = Number(url.searchParams.get("page") ?? "1") || 1;
  } catch {
    page = 1;
  }

  const octokit = new Octokit({ auth: accessToken });
  const response = await octokit.request("GET /search/repositories", {
    headers: { "X-GitHub-Api-Version": "2022-11-28" },
    q: q.join(" "),
    sort: !query ? "updated" : undefined,
    per_page: GET_ORG_REPOSITORIES_LIMIT,
    page,
  });
  return response.data;
}
