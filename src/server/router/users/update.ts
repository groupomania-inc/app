import { TRPCError } from "@trpc/server";

import { updateUserSchema } from "../../../schemas/user.schema";
import { createRouter } from "../context";

export default createRouter().mutation("update", {
    input: updateUserSchema,
    resolve: async ({ input, ctx }) => {
        const { displayName, profilePicture } = input;

        const user = ctx.session?.user;
        if (!user)
            throw new TRPCError({
                code: "UNAUTHORIZED",
                message: "Vous devez être connecté pour effectuer cette action",
            });

        await ctx.prisma.user.update({
            where: {
                id: user.id,
            },
            data: {
                displayName,
                profilePicture,
            },
        });
    },
});
