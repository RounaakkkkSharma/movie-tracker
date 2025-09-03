import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string; // string because you returned id as string in authorize
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }

  interface User {
    id: string;
  }
}
