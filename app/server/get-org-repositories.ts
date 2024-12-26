import { Octokit } from "octokit";
import { getAccessToken } from "~/lib/session";

export const GET_ORG_REPOSITORIES_LIMIT = 30;

export async function getOrgRepositories(request: Request) {
  const { GITHUB_ORG } = process.env;
  if (!GITHUB_ORG) throw new Error("No GITHUB_ORG.");

  const accessToken = await getAccessToken(request);

  const url = new URL(request.url);
  const query = url.searchParams.get("query");

  let page: number;
  try {
    page = Number(url.searchParams.get("page") ?? "1") || 1;
  } catch {
    page = 1;
  }

  const octokit = new Octokit({ auth: accessToken });
  const response = await octokit.request("GET /search/repositories", {
    headers: { "X-GitHub-Api-Version": "2022-11-28" },
    q: `org:${GITHUB_ORG} ${query ?? ""}`,
    sort: !query ? "updated" : undefined,
    per_page: GET_ORG_REPOSITORIES_LIMIT,
    page,
  });
  return response.data;
}

export async function getOrgRepository(request: Request, repo: string) {
  const { GITHUB_ORG } = process.env;
  if (!GITHUB_ORG) throw new Error("No GITHUB_ORG.");

  const accessToken = await getAccessToken(request);

  const octokit = new Octokit({ auth: accessToken });
  const response = await octokit.request("GET /repos/{owner}/{repo}", {
    headers: { "X-GitHub-Api-Version": "2022-11-28" },
    owner: GITHUB_ORG,
    repo,
  });
  return response.data;
}
