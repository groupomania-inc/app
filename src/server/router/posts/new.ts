import { createPostSchema } from "../../../schemas/post.schema";
import { createRouter } from "../context";

export default createRouter().mutation("new", {
    input: createPostSchema,
    resolve: async ({ ctx, input }) => {
        const post = await ctx.prisma.post.create({
            data: {
                body: input.body,
                image: <string>input.image ?? null,
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
});
