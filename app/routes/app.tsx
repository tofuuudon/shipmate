import { LoaderFunctionArgs } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { AppSidebar } from "~/components/ui/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "~/components/ui/sidebar";
import { getAccessToken } from "~/lib/session";
import { getMe } from "~/server/get-me";

export async function loader({ request }: LoaderFunctionArgs) {
  const accessToken = await getAccessToken(request);

  return await getMe(accessToken);
}

export default function App() {
  const data = useLoaderData<typeof loader>();

  return (
    <SidebarProvider>
      <AppSidebar
        avatarUrl={data.avatar_url}
        name={data.name}
        username={data.login}
      />
      <SidebarInset>
        <div className="p-4">
          <SidebarTrigger className="-ml-1 mb-4" />
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}