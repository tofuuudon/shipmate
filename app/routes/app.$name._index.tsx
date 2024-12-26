import { BookOpenText, Code } from "@phosphor-icons/react";
import { LoaderFunctionArgs, MetaArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { buttonVariants } from "~/components/ui/button";
import Page from "~/components/ui/page";
import { Separator } from "~/components/ui/separator";
import { getOrgRepository } from "~/server/get-org-repositories";

export function meta({ params }: MetaArgs) {
  return [{ title: `Documentation | ${params.name}` }];
}

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { name } = params;
  if (!name) throw new Error("No repo name.");
  const repo = await getOrgRepository(request, name);

  return {
    name: repo.name,
    description: repo.description,
    sourceUrl: repo.html_url,
  };
}

export default function AppName() {
  const data = useLoaderData<typeof loader>();

  return (
    <Page
      breadcrumbs={[{ name: "Catalog", path: "/app" }, { name: data.name }]}
    >
      <header className="flex justify-between pb-4">
        <div className="flex flex-col space-y-2">
          <h1 className="text-2xl font-bold">{data.name}</h1>
          <p className="text-gray-500 text-sm">{data.description}</p>
        </div>
        <div className="flex space-x-2">
          <a
            href={data.sourceUrl}
            target="_blank"
            className={buttonVariants({ variant: "outline", size: "icon" })}
          >
            <Code weight="bold" />
          </a>
          <a
            href={`/app/${data.name}/docs`}
            className={buttonVariants({ variant: "outline" })}
          >
            <BookOpenText weight="bold" /> Read Documentation
          </a>
        </div>
      </header>
      <Separator />
    </Page>
  );
}
