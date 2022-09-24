import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { likePostSchema } from "../../../schemas/post.schema";
import { createRouter } from "../context";

export default createRouter().mutation("like", {
    input: likePostSchema,
    output: z.boolean(),
    resolve: async ({ ctx, input }) => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const userId = ctx.session!.user!.id;

        const post = await ctx.prisma.post.findUnique({
            where: {
                id: input.postId,
            },
            include: {
                Likes: true,
            },
        });
        if (!post)
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "Post not found",
            });

        const like = post.Likes.find((x) => x.userId === userId);
        if (like)
            await ctx.prisma.like.delete({
                where: {
                    id: like.id,
                },
            });
        else {
            await ctx.prisma.like.create({
                data: {
                    User: {
                        connect: {
                            id: userId,
                        },
                    },
                    Post: {
                        connect: {
                            id: post.id,
                        },
                    },
                },
            });
        }

        return !like;
    },
});
