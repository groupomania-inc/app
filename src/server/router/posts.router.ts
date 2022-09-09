import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createPostSchema, deletePostSchema, likePostSchema } from "../../schemas/post.schema";
import { createRouter } from "./context";

export const postsRouter = createRouter()
    .middleware(async ({ ctx, next }) => {
        if (!ctx.session?.user)
            throw new TRPCError({
                code: "FORBIDDEN",
                message: "Can't create a post while logged out",
            });

        return next();
    })
    .mutation("new", {
        input: createPostSchema,
        resolve: async ({ ctx, input }) => {
            const post = await ctx.prisma.post.create({
                data: {
                    ...input,
                    User: {
                        connect: {
                            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                            id: ctx.session!.user!.id,
                        },
                    },
                },
            });

            return post;
        },
    })
    .query("get-all", {
        resolve: async ({ ctx }) => await ctx.prisma.post.findMany({
            include: {
                Likes: true,
                User: true,
            },
        })
    })
    .mutation("like", {
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
    })
    .mutation("delete", {
        input: deletePostSchema,
        resolve: async ({ ctx, input }) => {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const userId = ctx.session!.user!.id;

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

            if (post.userId !== userId)
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
