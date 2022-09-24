import { TRPCError } from "@trpc/server";

import { getSinglePostSchema } from "../../../schemas/post.schema";
import { createRouter } from "../context";

export default createRouter().query("get-single", {
    input: getSinglePostSchema,
    resolve: async ({ ctx, input }) => {
        const post = await ctx.prisma.post.findUnique({
            where: {
                id: input.postId,
            },
        });

        if (!post)
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "Post not found",
            });

        return post;
    },
});
