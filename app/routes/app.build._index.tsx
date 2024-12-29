import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import Page from "~/components/ui/page";
import TemplateCard from "~/components/ui/template-card";
import { getTemplates } from "~/server/get-templates";

export function meta() {
  return [{ title: "Build" }];
}

export async function loader({ request }: LoaderFunctionArgs) {
  return await getTemplates(request);
}

export default function BuildIndex() {
  const data = useLoaderData<typeof loader>();

  return (
    <Page breadcrumbs={[{ name: "Build" }]}>
      <div className="grid grid-cols-2 gap-3">
        {data.map((template) => (
          <TemplateCard
            key={template.name}
            name={template.name}
            description={template.description}
            sourceUrl={template.html_url}
            updatedAt={template.updated_at}
          />
        ))}
      </div>
    </Page>
  );
}
