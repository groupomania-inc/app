import { TRPCError } from "@trpc/server";

import { createRouter } from "../context";

export default createRouter().query("me", {
    resolve: async ({ ctx }) => {
        const userId = ctx.session?.user?.id;
        if (!userId) return null;

        const user = await ctx.prisma.user.findUnique({
            where: {
                id: userId,
            },
        });

        if (!user)
            throw new TRPCError({
                code: "UNAUTHORIZED",
                message: "Cet utilisateur n'existe pas",
            });

        return user;
    },
});
