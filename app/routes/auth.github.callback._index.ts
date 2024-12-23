import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { authenticator } from "~/lib/auth";
import { commitSession, getSession } from "~/lib/session";

export async function loader({ request }: LoaderFunctionArgs) {
  const data = (await authenticator.authenticate("github", request)) as {
    accessToken: string;
  };

  const session = await getSession(request.headers.get("cookie"));
  session.set("accessToken", data.accessToken);

  return redirect("/app", {
    headers: { "Set-Cookie": await commitSession(session) },
  });
}
