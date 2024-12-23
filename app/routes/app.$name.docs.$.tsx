import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useParams } from "@remix-run/react";
import { buttonVariants } from "~/components/ui/button";
import { getRepositoryDocs } from "~/server/get-repository-docs";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const data = await getRepositoryDocs(request, params.name as string);

  return {
    html: data.find((doc) => doc.path === params["*"])?.html,
    docs: data
      .filter((doc) => doc.name !== "README.md")
      .map((doc) => ({ ...doc, html: undefined })),
  };
}

export default function IDDocsSplat() {
  const data = useLoaderData<typeof loader>();
  const params = useParams();

  return (
    <div>
      <p className="font-bold text-sm">Table of Content</p>
      <ul className="list-disc pl-4 pb-8 mb-8 border-b border-gray-300">
        {data.docs.map((doc) => (
          <li key={doc.path}>
            <a
              href={`/app/${params.name}/docs/${doc.path}`}
              className={buttonVariants({
                variant: "link",
                className: "pl-0 pr-0 pb-0 h-fit",
              })}
            >
              {doc.name}
            </a>
          </li>
        ))}
      </ul>

      {data.html ? (
        <div dangerouslySetInnerHTML={{ __html: data.html }} />
      ) : (
        <p>No document.</p>
      )}
    </div>
  );
}
