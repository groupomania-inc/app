import { createRouter } from "../context";

export default createRouter().query("get-all", {
    resolve: async ({ ctx }) =>
        await ctx.prisma.post.findMany({
            include: {
                Likes: true,
                User: true,
            },
            orderBy: [
                {
                    createdAt: "desc",
                },
            ],
        }),
});
