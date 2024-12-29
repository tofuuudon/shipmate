import { Octokit } from "octokit";
import { getAccessToken } from "~/lib/session";

export const GET_ORG_REPOSITORIES_LIMIT = 30;

function requestContent(
  octokit: Octokit,
  owner: string,
  repo: string,
  path: string,
) {
  return octokit.request("GET /repos/{owner}/{repo}/contents/{path}", {
    headers: { "X-GitHub-Api-Version": "2022-11-28" },
    owner,
    repo,
    path,
  });
}

export async function getTemplates(request: Request) {
  const { GITHUB_ORG } = process.env;
  if (!GITHUB_ORG) throw new Error("No GITHUB_ORG.");

  const accessToken = await getAccessToken(request);

  const octokit = new Octokit({ auth: accessToken });
  const searchResponse = await octokit.request("GET /search/repositories", {
    headers: { "X-GitHub-Api-Version": "2022-11-28" },
    q: `org:${GITHUB_ORG} template:true`,
    sort: "updated",
  });
  const workflowResponse = await Promise.allSettled(
    searchResponse.data.items.map((item) =>
      requestContent(
        octokit,
        GITHUB_ORG,
        item.name,
        ".github/workflows/setup.yaml",
      ),
    ),
  );
  const filterMask = workflowResponse.map((res) => res.status === "fulfilled");
  return searchResponse.data.items.filter((_, i) => filterMask[i]);
}

export async function getTemplatePresets(request: Request, repo: string) {
  const { GITHUB_ORG } = process.env;
  if (!GITHUB_ORG) throw new Error("No GITHUB_ORG.");

  const accessToken = await getAccessToken(request);

  const octokit = new Octokit({ auth: accessToken });

  try {
    const dirResponse = await requestContent(
      octokit,
      GITHUB_ORG,
      repo,
      ".github/setup",
    );
    const dirData = dirResponse.data as unknown as Record<string, string>[];
    const responses = (await Promise.all(
      dirData.map((doc) => requestContent(octokit, GITHUB_ORG, repo, doc.path)),
    )) as unknown as { data: Record<string, string> }[];
    return responses.map((res) => {
      const content = Buffer.from(res.data.content, "base64").toString("utf8");
      return {
        ...JSON.parse(content),
        filename: res.data.path.replace(".github/setup/", ""),
      };
    });
  } catch {
    console.warn(`No docs available for ${GITHUB_ORG}/${repo}.`);
    return [];
  }
}
