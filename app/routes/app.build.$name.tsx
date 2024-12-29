import { Code } from "@phosphor-icons/react";
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import { useFetcher, useLoaderData } from "@remix-run/react";
import BuilderForm from "~/components/ui/builder-form";
import { buttonVariants } from "~/components/ui/button";
import Page from "~/components/ui/page";
import { Separator } from "~/components/ui/separator";
import Spinner from "~/components/ui/spinner";
import { createOrgRepository } from "~/server/create-org-repository";
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

  return {
    repo: {
      name: repo.name,
      description: repo.description,
      sourceUrl: repo.html_url,
    },
    presets,
  };
}

export async function action({ request, params }: ActionFunctionArgs) {
  const { name: templateName } = params;
  if (!templateName) throw new Error("No template name.");

  const { name, description, ...payload } = await request.json();
  if (!name) throw new Error("No name.");
  if (!description) throw new Error("No description.");

  await createOrgRepository(
    request,
    templateName,
    name,
    description,
    JSON.stringify(payload),
  );

  return redirect(`/app/${name}`);
}

export default function BuildName() {
  const data = useLoaderData<typeof loader>();
  const fetcher = useFetcher<typeof action>();

  return (
    <Page breadcrumbs={[{ name: "Build" }]}>
      <header className="flex justify-between pb-4">
        <div className="flex flex-col space-y-2">
          <h1 className="text-2xl font-bold">{data.repo.name}</h1>
          <p className="text-gray-500 text-sm">{data.repo.description}</p>
        </div>
        <div className="flex space-x-2">
          <a
            href={data.repo.sourceUrl}
            target="_blank"
            className={buttonVariants({ variant: "outline", size: "icon" })}
          >
            <Code weight="bold" />
          </a>
        </div>
      </header>
      <Separator />
      {fetcher.state === "submitting" ? (
        <div className="flex items-center justify-center space-x-2 w-full h-full">
          <Spinner />
          <p className="text-sm text-gray-600">Creating new repository ...</p>
        </div>
      ) : (
        <BuilderForm fetcher={fetcher} presets={data.presets} />
      )}
    </Page>
  );
}
