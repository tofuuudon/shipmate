import yaml from "js-yaml";
import { Octokit } from "octokit";
import { getAccessToken } from "~/lib/session";

export const GET_ORG_REPOSITORIES_LIMIT = 30;

type Workflow = {
  on: {
    workflow_dispatch: {
      inputs: Record<
        string,
        { description: string; required: boolean; type: "string" | "boolean" }
      >;
    };
  };
};

function requestSetupWorkflow(octokit: Octokit, owner: string, repo: string) {
  return octokit.request("GET /repos/{owner}/{repo}/contents/{path}", {
    headers: { "X-GitHub-Api-Version": "2022-11-28" },
    owner,
    path: ".github/workflows/setup.yaml",
    repo,
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
      requestSetupWorkflow(octokit, GITHUB_ORG, item.name),
    ),
  );
  const filterMask = workflowResponse.map((res) => res.status === "fulfilled");
  return searchResponse.data.items.filter((_, i) => filterMask[i]);
}

export async function getTemplateWorkflow(request: Request, repo: string) {
  const { GITHUB_ORG } = process.env;
  if (!GITHUB_ORG) throw new Error("No GITHUB_ORG.");

  const accessToken = await getAccessToken(request);
  const octokit = new Octokit({ auth: accessToken });
  const data = (await requestSetupWorkflow(octokit, GITHUB_ORG, repo))
    .data as unknown as Record<string, string>;
  const content = Buffer.from(data.content, "base64").toString("utf8");
  return yaml.load(content) as Workflow;
}
