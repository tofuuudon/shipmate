import { createMemorySessionStorage } from "@remix-run/node";

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

export { commitSession, destroySession, getSession };
