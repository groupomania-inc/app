import { createRouter } from "../context";

export default createRouter().mutation("me", {
    resolve: ({ ctx }) => {
        return ctx.session?.user;
    },
});
