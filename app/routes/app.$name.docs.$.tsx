import { Empty, Files, HandPointing } from "@phosphor-icons/react";
import { LoaderFunctionArgs, MetaArgs } from "@remix-run/node";
import { useLoaderData, useNavigate, useParams } from "@remix-run/react";
import Page from "~/components/ui/page";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Separator } from "~/components/ui/separator";
import { getRepositoryDocs } from "~/server/get-repository-docs";

export function meta({ params }: MetaArgs) {
  return [{ title: `Documentation | ${params.name}` }];
}

export async function loader({ request, params }: LoaderFunctionArgs) {
  const data = await getRepositoryDocs(request, params.name as string);

  return {
    html: data.find((doc) => doc.path === params["*"])?.html,
    docs: data.map((doc) => ({ ...doc, html: undefined })),
  };
}

export default function IDDocsSplat() {
  const data = useLoaderData<typeof loader>();

  const navigate = useNavigate();
  const params = useParams();

  const noDocs = data.docs.length === 0;

  return (
    <Page
      breadcrumbs={[
        { name: "Catalog", path: "/app" },
        { name: params.name },
        { name: "Documentation" },
      ]}
    >
      <div className="w-full max-w-64 flex space-x-2 items-center">
        <Files weight="bold" size={20} className="text-gray-700" />
        <Select
          onValueChange={(value) =>
            navigate(`/app/${params.name}/docs/${value}`)
          }
          disabled={noDocs}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a document" />
          </SelectTrigger>
          <SelectContent>
            {data.docs.map((doc) => (
              <SelectItem key={doc.path} value={doc.path}>
                {doc.title ?? doc.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Separator className="mt-4 mb-8" />
      {data.html ? (
        <div id="doc" dangerouslySetInnerHTML={{ __html: data.html }} />
      ) : (
        <div className="h-full w-full flex flex-col items-center justify-center space-y-4 text-gray-500">
          {noDocs ? (
            <Empty size={32} weight="light" />
          ) : (
            <HandPointing size={32} weight="light" />
          )}
          <p className="text-sm">
            {noDocs
              ? `No documents avaiable for ${params.name} yet`
              : "Please select a document"}
          </p>
        </div>
      )}
    </Page>
  );
}
