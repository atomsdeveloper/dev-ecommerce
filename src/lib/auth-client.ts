import { createAuthClient } from "better-auth/react"; // make sure to import from better-auth/react

export const authClient = createAuthClient({});

export const signIngGoogle = async () => {
  console.log("Login com Google");
  await authClient.signIn.social({
    provider: "google",
  });
};
