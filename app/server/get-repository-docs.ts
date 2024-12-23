import Markdoc from "@markdoc/markdoc";
import { Octokit } from "octokit";
import { getAccessToken } from "~/lib/session";

export type Documentation = {
  name: string;
  path: string;
  content: string;
  html: string | null;
};

function requestContent(
  accessToken: string,
  owner: string,
  repo: string,
  path: string,
) {
  const octokit = new Octokit({ auth: accessToken });
  return octokit.request("GET /repos/{owner}/{repo}/contents/{path}", {
    headers: { "X-GitHub-Api-Version": "2022-11-28" },
    owner,
    repo,
    path,
  });
}

export async function getRepositoryDocs(
  request: Request,
  repo: string,
): Promise<Documentation[]> {
  const { GITHUB_ORG } = process.env;
  if (!GITHUB_ORG) throw new Error("No GITHUB_ORG.");

  const accessToken = await getAccessToken(request);

  const dirResponse = await requestContent(
    accessToken,
    GITHUB_ORG,
    repo,
    "docs",
  );
  const dirData = dirResponse.data as unknown as Record<string, string>[];
  const responses = (await Promise.all([
    requestContent(accessToken, GITHUB_ORG, repo, "README.md"),
    ...dirData.map((doc) =>
      requestContent(accessToken, GITHUB_ORG, repo, doc.path),
    ),
  ])) as unknown as { data: Record<string, string> }[];
  return responses.map((res) => {
    const content = Buffer.from(res.data.content, "base64").toString("utf8");
    const ast = Markdoc.parse(content);
    const html = Markdoc.renderers.html(Markdoc.transform(ast));

    return {
      name: res.data.name.replace(".md", ""),
      path: res.data.path.replace("docs/", ""),
      content,
      html,
    };
  });
}
