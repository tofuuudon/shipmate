import { createMemorySessionStorage, redirect } from "@remix-run/node";

type SessionData = {
  accessToken: string;
};

type SessionFlashData = {
  error: string;
};

const { getSession, commitSession, destroySession } =
  createMemorySessionStorage<SessionData, SessionFlashData>({
    cookie: {
      name: "shipmate",
    },
  });

export async function getAccessToken(request: Request) {
  const { data } = await getSession(request.headers.get("cookie"));
  if (!data.accessToken) throw redirect("/auth/login");

  return data.accessToken;
}

export { commitSession, destroySession, getSession };
