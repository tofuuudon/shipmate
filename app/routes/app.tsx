import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { AppSidebar } from "~/components/ui/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "~/components/ui/sidebar";
import { getSession } from "~/lib/session";
import { getMe } from "~/server/get-me";

export async function loader({ request }: LoaderFunctionArgs) {
  const { data } = await getSession(request.headers.get("cookie"));
  if (!data.accessToken) return redirect("/auth/login");

  const user = await getMe(data.accessToken);
  return user.data;
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
          <SidebarTrigger className="-ml-1" />
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
