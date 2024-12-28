import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { useFetcher, useLoaderData } from "@remix-run/react";
import BuilderForm from "~/components/ui/builder-form";
import Page from "~/components/ui/page";
import { getOrgRepository } from "~/server/get-org-repositories";
import { getTemplatePresets } from "~/server/get-templates";

export function meta() {
  return [{ title: "Build" }];
}

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { name } = params;
  if (!name) throw new Error("No template found.");

  const repo = await getOrgRepository(request, name);
  const presets = await getTemplatePresets(request, name);

  return { repo: { name: repo.name }, presets };
}

export async function action({ request, params }: ActionFunctionArgs) {
  const { name: templateName } = params;
  if (!templateName) throw new Error("No template name.");

  const { name, description, ...payload } = await request.json();
  if (!name) throw new Error("No name.");
  if (!description) throw new Error("No description.");

  // TODO: Pass payload to create action

  return {};
  // await createOrgRepository(request, templateName, name, description, inputs);
  //
  // return redirect(`/app/${name}`);
}

export default function BuildName() {
  const data = useLoaderData<typeof loader>();
  const fetcher = useFetcher<typeof action>();

  return (
    <Page breadcrumbs={[{ name: "Build" }]} loading={fetcher.state !== "idle"}>
      <BuilderForm fetcher={fetcher} presets={data.presets} />
    </Page>
  );
}
