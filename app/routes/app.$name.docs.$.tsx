import { Files } from "@phosphor-icons/react";
import { LoaderFunctionArgs } from "@remix-run/node";
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

  if (data.docs.length === 0) return <p>No documentation discovered.</p>;

  return (
    <Page
      breadcrumbs={[{ name: "Catalog", path: "/app" }, { name: params.name }]}
    >
      <div className="w-full max-w-64 flex space-x-2 items-center">
        <Files weight="bold" size={20} className="text-gray-700" />
        <Select
          onValueChange={(value) =>
            navigate(`/app/${params.name}/docs/${value}`)
          }
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
        <p>No document selected.</p>
      )}
    </Page>
  );
}
