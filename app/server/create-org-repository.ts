import { Octokit } from "octokit";
import { getAccessToken } from "~/lib/session";

export async function createOrgRepository(
  request: Request,
  templateName: string,
  name: string,
  description: string,
) {
  const { GITHUB_ORG } = process.env;
  if (!GITHUB_ORG) throw new Error("No GITHUB_ORG.");

  const accessToken = await getAccessToken(request);

  const octokit = new Octokit({ auth: accessToken });
  const response = await octokit.request(
    "POST /repos/{template_owner}/{template_repo}/generate",
    {
      headers: { "X-GitHub-Api-Version": "2022-11-28" },
      template_owner: GITHUB_ORG,
      template_repo: templateName,
      owner: GITHUB_ORG,
      name,
      description,
    },
  );
  console.log(response);
  return {};
}
