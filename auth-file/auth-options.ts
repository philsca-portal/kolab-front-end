import axios from "axios";
import { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import SpotifyProvider from "next-auth/providers/spotify";
import GithubProvider from "next-auth/providers/github";
import DiscordProvider from "next-auth/providers/discord";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prismadb from "@/back-end/src/lib/prismadb";

export const AuthOptions: NextAuthOptions = {
    providers: [
    GoogleProvider({
        clientId: process.env.GOOGLE_ID || '',
        clientSecret: process.env.GOOGLE_SECRET || '',
    }),
    SpotifyProvider({
        clientId: process.env.SPOTIFY_CLIENT_ID || '',
        clientSecret: process.env.SPOTIFY_CLIENT_SECRET || ''
    }),
    GithubProvider({
        clientId: process.env.GITHUB_ID || '',
        clientSecret: process.env.GITHUB_SECRET || ''
    }),
    DiscordProvider({
        clientId: process.env.DISCORD_CLIENT_ID || '',
        clientSecret: process.env.DISCORD_CLIENT_SECRET || ''
    }),
    Credentials({
        name: 'credentials',
        credentials:{
            email:{
                label: "Email",
                type: "text"
            },
            password:{
                label: "Password",
                type: "password"
            }
        },
        async authorize(credentials){
            try {
                const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/signin`,{
                    email: credentials?.email,
                    password: credentials?.password
                });
    
                if(response.data.success){
                    const user = response.data.user;
                    return Promise.resolve(user);
                }else {                                                                                                                                
                    throw new Error('Authentication failed');
                }
            } catch (error) {
                console.error('Authentication error:', error);
                return Promise.resolve(null);
            }
        }
    })
  ],
  pages:{
    signIn: '/sign-in',
    error: '/auth/error'
  },
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
        if(account?.provider === 'google'){
            const accountProvider = 'google'; 
            if(user){
                const email = user.email;
                const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/checkEmail`, {
                    email,
                    accountProvider
                });

                if(response.data.success === false){
                    return '/sign-in?redirected=1';
                }
                
                if(response.data.success === true){
                    return true;
                }
            }
        }

        if(account?.provider === 'github'){
            const accountProvider = 'github'; 
            if(user){
                const email = user.email;
                const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/checkEmail`, {
                    email,
                    accountProvider
                });

                if(response.data.success === false){
                    return '/sign-in?redirected=1';
                }
                if(response.data.success === true){
                    return true;
                }
            }
        }

        if(account?.provider === 'discord'){
            const accountProvider = 'discord';
            if(user){
                const email = user.email;
                const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/checkEmail`, {
                    email,
                    accountProvider
                });

                if(response.data.success === false){
                    return '/sign-in?redirected=1';
                }

                if(response.data.success === true){
                    return true
                }
            }
        }
        return true
    },
    session: async({ session }) => {
        const name = session.user.name;
        const email = session.user.email;

        const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/getUserIdUsingSession`, {name, email});
        if(response.data.success){
            return {
                ...session,
                user: {
                    ...session.user,
                    userId: response.data.userId,
                    sessionExpires: session.expires
                }
            }
        }else{
            return {
                ...session,
                user: {
                    ...session.user
                }
            } 
        }
    },
  },
  adapter: PrismaAdapter(prismadb),
  jwt:{
    secret: process.env.NEXTAUTH_JWT_SECRET,
  },
  secret: process.env.NEXTAUTH_SECRET,
}