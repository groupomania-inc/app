import { TRPCError } from "@trpc/server";

import { createPostSchema, getSinglePostSchema } from "../../schemas/post.schema";
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
                    user: {
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
        resolve: ({ ctx }) => ctx.prisma.post.findMany(),
    })
    .query("get-single", {
        input: getSinglePostSchema,
        resolve: ({ ctx, input }) =>
            ctx.prisma.post.findUnique({
                where: {
                    id: input.postId,
                },
            }),
    });
