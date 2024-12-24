import { MagnifyingGlass } from "@phosphor-icons/react";
import { type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useSearchParams } from "@remix-run/react";
import { ChangeEvent, useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import Page from "~/components/ui/page";
import RepositoryCard from "~/components/ui/repository-card";
import { getOrgRepositories } from "~/server/get-org-repositories";

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

  const [queryValue, setQueryValue] = useState<string>(query || "");

  function handleQueryChange(event: ChangeEvent<HTMLInputElement>) {
    setQueryValue(event.target.value);
  }

  return (
    <Page breadcrumbs={[{ name: "Catalog" }]}>
      <div className="flex flex-col space-y-6">
        <form method="GET" className="flex space-x-2">
          <Input
            name="query"
            type="search"
            placeholder="Search repositories"
            value={queryValue}
            onChange={handleQueryChange}
            className="max-w-[400px]"
          />
          <Button type="submit" size="icon">
            <MagnifyingGlass weight="bold" />
          </Button>
        </form>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          {data.map((repo) => (
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
