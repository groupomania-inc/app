import { TRPCError } from "@trpc/server";

import { updatePostSchema } from "../../../schemas/post.schema";
import { createRouter } from "../context";

export default createRouter().mutation("update", {
    input: updatePostSchema,
    resolve: async ({ ctx, input }) => {
        const post = await ctx.prisma.post.update({
            where: {
                id: input.postId,
            },
            data: {
                body: input.body,
                edited: true,
            },
        });

        if (!post)
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "Post not found",
            });
    },
});
