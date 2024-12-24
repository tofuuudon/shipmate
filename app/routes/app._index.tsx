import {
  CaretDoubleLeft,
  CaretDoubleRight,
  CaretLeft,
  CaretRight,
  MagnifyingGlass,
} from "@phosphor-icons/react";
import { type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useSearchParams } from "@remix-run/react";
import { ChangeEvent, useState } from "react";
import { Button, ButtonProps } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import Page from "~/components/ui/page";
import RepositoryCard from "~/components/ui/repository-card";
import {
  GET_ORG_REPOSITORIES_LIMIT,
  getOrgRepositories,
} from "~/server/get-org-repositories";

export function meta() {
  return [{ title: "Catalog" }];
}

export async function loader({ request }: LoaderFunctionArgs) {
  return await getOrgRepositories(request);
}

export default function AppIndex() {
  const data = useLoaderData<typeof loader>();

  const [searchParams] = useSearchParams();
  const query = searchParams.get("query");

  let page: number;
  try {
    page = Number(searchParams.get("page")) || 1;
  } catch {
    page = 1;
  }
  const totalPages = Math.ceil(data.total_count / GET_ORG_REPOSITORIES_LIMIT);
  const hasPrevious = page > 1;
  const hasNext = page < totalPages;

  const [queryValue, setQueryValue] = useState<string>(query || "");

  function handleQueryChange(event: ChangeEvent<HTMLInputElement>) {
    setQueryValue(event.target.value);
  }

  const buttonProps: ButtonProps = {
    name: "page",
    variant: "ghost",
    size: "icon",
    className: "p-1 w-fit h-fit",
  };

  return (
    <Page breadcrumbs={[{ name: "Catalog" }]}>
      <div className="flex flex-col space-y-6">
        <div className="flex justify-between items-center space-x-4">
          <form method="GET" className="flex space-x-2 justify-between w-full">
            <div className="flex space-x-2 w-full">
              <Input
                name="query"
                type="search"
                placeholder="Search repositories"
                value={queryValue}
                onChange={handleQueryChange}
                className="w-full max-w-[300px]"
              />
              <Button type="submit" size="icon">
                <MagnifyingGlass weight="bold" />
              </Button>
            </div>

            <div className="flex items-center">
              <Button value={1} disabled={!hasPrevious} {...buttonProps}>
                <CaretDoubleLeft weight="bold" />
              </Button>
              <Button value={page - 1} disabled={!hasPrevious} {...buttonProps}>
                <CaretLeft weight="bold" />
              </Button>
              <p className="text-sm text-gray-700 text-nowrap mx-2">
                {page} / {totalPages}
              </p>
              <Button value={page + 1} disabled={!hasNext} {...buttonProps}>
                <CaretRight weight="bold" />
              </Button>
              <Button value={totalPages} disabled={!hasNext} {...buttonProps}>
                <CaretDoubleRight weight="bold" />
              </Button>
            </div>
          </form>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          {data.items.map((repo) => (
            <RepositoryCard
              key={repo.name}
              name={repo.name}
              description={repo.description}
              isPrivate={repo.private}
              stars={repo.stargazers_count}
              sourceUrl={repo.html_url}
              updatedAt={repo.updated_at}
            />
          ))}
        </div>
      </div>
    </Page>
  );
}
