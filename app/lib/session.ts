import { createMemorySessionStorage, redirect } from "@remix-run/node";

type SessionData = {
  accessToken: string;
};

type SessionFlashData = {
  error: string;
};

const { getSession, commitSession, destroySession } = (() => {
  if (!process.env.COOKIE_SECRETS) throw new Error("No COOKIE_SECRETS.");

  return createMemorySessionStorage<SessionData, SessionFlashData>({
    cookie: {
      name: "shipmate",
      secrets: process.env.COOKIE_SECRETS.split(","),
    },
  });
})();

export async function getAccessToken(request: Request) {
  const { data } = await getSession(request.headers.get("cookie"));
  if (!data.accessToken) throw redirect("/auth/login");

  return data.accessToken;
}

export { commitSession, destroySession, getSession };
