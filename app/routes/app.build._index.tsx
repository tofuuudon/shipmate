import type { MetaFunction } from "@remix-run/node";
import Page from "~/components/ui/page";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function BuildIndex() {
  return (
    <Page breadcrumbs={[{ name: "Build" }]}>
      <h1>Build Index</h1>
    </Page>
  );
}
