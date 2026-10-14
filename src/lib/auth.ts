import { betterAuth } from "better-auth";
import database from "./db.js";

const googleClientId = process.env.GOOGLE_CLIENT_ID?.trim();
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim();
const githubClientId = process.env.GITHUB_CLIENT_ID?.trim();
const githubClientSecret = process.env.GITHUB_CLIENT_SECRET?.trim();

export const googleEnabled = Boolean(googleClientId && googleClientSecret);
export const githubEnabled = Boolean(githubClientId && githubClientSecret);

export const auth = betterAuth({
  database,
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
  emailAndPassword: { enabled: true },
  socialProviders: {
    ...(googleClientId && googleClientSecret ? {
      google: { clientId: googleClientId, clientSecret: googleClientSecret },
    } : {}),
    ...(githubClientId && githubClientSecret ? {
      github: { clientId: githubClientId, clientSecret: githubClientSecret },
    } : {}),
  },
});
