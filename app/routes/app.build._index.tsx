import Page from "~/components/ui/page";

export function meta() {
  return [{ title: "Build" }];
}

export default function BuildIndex() {
  return (
    <Page breadcrumbs={[{ name: "Build" }]}>
      <h1>Build Index</h1>
    </Page>
  );
}
