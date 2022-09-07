// Prisma adapter for NextAuth, optional and can be removed
import NextAuth, { type NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
    // Configure one or more authentication providers
    // adapter: PrismaAdapter(prisma),
    providers: [
        
    ],
};

export default NextAuth(authOptions);
