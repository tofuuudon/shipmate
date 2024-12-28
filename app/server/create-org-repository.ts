import { Octokit } from "octokit";
import { getAccessToken } from "~/lib/session";

export async function createOrgRepository(
  request: Request,
  templateName: string,
  name: string,
  description: string,
  payload: string,
) {
  const { GITHUB_ORG } = process.env;
  if (!GITHUB_ORG) throw new Error("No GITHUB_ORG.");

  const accessToken = await getAccessToken(request);

  const octokit = new Octokit({ auth: accessToken });
  await octokit.request(
    "POST /repos/{template_owner}/{template_repo}/generate",
    {
      headers: { "X-GitHub-Api-Version": "2022-11-28" },
      template_owner: GITHUB_ORG,
      template_repo: templateName,
      owner: GITHUB_ORG,
      name,
      description,
      private: true,
    },
  );

  for (let i = 0; i < 10; i++) {
    try {
      await octokit.request(
        "GET /repos/{owner}/{repo}/actions/workflows/{workflow_id}",
        {
          headers: { "X-GitHub-Api-Version": "2022-11-28" },
          owner: GITHUB_ORG,
          repo: name,
          workflow_id: "setup.yaml",
          ref: "main",
        },
      );
      break;
    } catch {
      await new Promise((resolve) => setTimeout(() => resolve(true), 1000));
    }
  }

  return octokit.request(
    "POST /repos/{owner}/{repo}/actions/workflows/{workflow_id}/dispatches",
    {
      headers: { "X-GitHub-Api-Version": "2022-11-28" },
      owner: GITHUB_ORG,
      repo: name,
      workflow_id: "setup.yaml",
      ref: "main",
      inputs: {
        payload,
      },
    },
  );
}
