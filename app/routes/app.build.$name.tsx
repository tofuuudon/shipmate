import { zodResolver } from "@hookform/resolvers/zod";
import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { useFetcher } from "@remix-run/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import Page from "~/components/ui/page";
import { createOrgRepository } from "~/server/create-org-repository";
import { getOrgRepository } from "~/server/get-org-repositories";
import { getTemplateWorkflow } from "~/server/get-templates";

export function meta() {
  return [{ title: "Build" }];
}

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { name } = params;
  if (!name) throw new Error("No template found.");

  const repo = await getOrgRepository(request, name);
  const workflow = await getTemplateWorkflow(request, name);

  return {
    repo: { name: repo.name },
    inputs: workflow.on.workflow_dispatch.inputs,
  };
}

export async function action({ request, params }: ActionFunctionArgs) {
  const { name: templateName } = params;
  if (!templateName) throw new Error("No template name.");

  const { name, description } = await request.json();
  if (!name) throw new Error("No name.");
  if (!description) throw new Error("No description.");

  return await createOrgRepository(request, templateName, name, description);
}

const formSchema = z.object({
  name: z.string(),
  description: z.string(),
});

export default function BuildIndex() {
  // const data = useLoaderData<typeof loader>();
  // const inputs = Object.entries(data.inputs).map(([key, value]) => ({
  //   key,
  //   ...value,
  // }));

  const fetcher = useFetcher<typeof action>();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  function handleSubmit(data: z.infer<typeof formSchema>) {
    fetcher.submit(data, {
      method: "POST",
      encType: "application/json",
    });
  }

  console.log(fetcher.data);

  return (
    <Page breadcrumbs={[{ name: "Build" }]}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Repository Name" {...field} />
                </FormControl>
                <FormDescription>This is your repo name</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input placeholder="Description" {...field} />
                </FormControl>
                <FormDescription>Some short brief</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </Page>
  );
}
