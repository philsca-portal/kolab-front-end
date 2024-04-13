import NextAuth from "next-auth"

declare module "next-auth" {
  interface User{
    userId: string
  }
  interface Session {
    user: User & {
        userId: string;
        sessionExpires: string;
    }
    token:{
        userId: string
    }
  }
}