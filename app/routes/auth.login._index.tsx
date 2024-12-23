import { GithubLogo } from "@phosphor-icons/react";
import { ActionFunctionArgs } from "@remix-run/node";
import { Button } from "~/components/ui/button";
import { authenticator } from "~/lib/auth";

export async function action({ request }: ActionFunctionArgs) {
  await authenticator.authenticate("github", request);

  return null;
}

export default function LoginIndex() {
  return (
    <form method="POST">
      <div className="flex flex-col justify-center items-center min-h-screen space-y-4">
        <h1 className="text-3xl font-semibold tracking-tight">shipmate</h1>
        <Button>
          <GithubLogo weight="fill" /> Login with GitHub
        </Button>
      </div>
    </form>
  );
}
