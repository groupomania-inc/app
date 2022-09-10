// Prisma adapter for NextAuth, optional and can be removed
import { PrismaClient } from "@prisma/client";
import { verify } from "argon2";
import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
    // Configure one or more authentication providers
    // adapter: PrismaAdapter(prisma),
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { type: "email" },
                password: { type: "password" },
            },
            authorize: async (credentials) => {
                if (!credentials) return null;
                const { email, password } = credentials;

                const user = await prisma.user.findFirst({
                    where: { email },
                });

                if (!user || !(await verify(user.password, password))) return null;

                return user;
            },
        }),
    ],
    pages: {
        signIn: "/auth/sign-in",
        newUser: "/auth/sign-up",
    },
    session: {
        strategy: "jwt",
    },
    callbacks: {
        jwt: async ({ token, user }) => {
            if (user) {
                token.uid = user.id;
                token.isAdmin = user.permissions === 1;
            }
            return token;
        },
        session: async ({ session, token }) => {
            if (session?.user) {
                session.user.id = <string>token.uid;
                session.user.isAdmin = <boolean>token.isAdmin;
            }
            return session;
        },
    },
};

export default NextAuth(authOptions);
