import { Authenticator } from "remix-auth";
import { GitHubStrategy } from "remix-auth-github";

function createStrategy() {
  const {
    GITHUB_OAUTH_APP_CLIENT_ID,
    GITHUB_OAUTH_APP_CLIENT_SECRET,
    GITHUB_OAUTH_APP_REDIRECT_URI,
  } = process.env;

  if (!GITHUB_OAUTH_APP_CLIENT_ID)
    throw new Error("Missing GITHUB_OAUTH_APP_CLIENT_ID.");
  if (!GITHUB_OAUTH_APP_CLIENT_SECRET)
    throw new Error("Missing GITHUB_OAUTH_APP_CLIENT_SECRET.");
  if (!GITHUB_OAUTH_APP_REDIRECT_URI)
    throw new Error("Missing GITHUB_OAUTH_APP_REDIRECT_URI.");

  return new GitHubStrategy(
    {
      clientId: GITHUB_OAUTH_APP_CLIENT_ID,
      clientSecret: GITHUB_OAUTH_APP_CLIENT_SECRET,
      redirectURI: GITHUB_OAUTH_APP_REDIRECT_URI,
    },
    async ({ tokens }) => {
      return { accessToken: tokens.accessToken() };
    },
  );
}

const strategy = createStrategy();

export const authenticator = new Authenticator();
authenticator.use(strategy, "github");
