import { TRPCError } from "@trpc/server";

import { deletePostSchema } from "../../../schemas/post.schema";
import { createRouter } from "../context";

export default createRouter().mutation("delete", {
    input: deletePostSchema,
    resolve: async ({ ctx, input }) => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const user = ctx.session!.user!;

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

        if (!user.isAdmin && post.userId !== user.id)
            throw new TRPCError({
                code: "FORBIDDEN",
                message: "You can't delete this post, it was created by an other user",
            });

        await ctx.prisma.post.delete({
            where: {
                id: input.postId,
            },
        });
    },
});
