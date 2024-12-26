import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import Page from "~/components/ui/page";
import { getOrgRepository } from "~/server/get-org-repositories";
import { getTemplateWorkflow } from "~/server/get-templates";

export function meta() {
  return [{ title: "Build" }];
}

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { name } = params;
  if (!name) throw new Error("No template found.");

  const repo = await getOrgRepository(request, name);
  const workflow = await getTemplateWorkflow(request, name);

  return {
    repo: { name: repo.name },
    inputs: workflow.on.workflow_dispatch.inputs,
  };
}

export default function BuildIndex() {
  const data = useLoaderData<typeof loader>();
  const inputs = Object.entries(data.inputs).map(([key, value]) => ({
    key,
    ...value,
  }));

  console.log(inputs);

  return (
    <Page breadcrumbs={[{ name: "Build" }]}>
      <p>Content</p>
    </Page>
  );
}
