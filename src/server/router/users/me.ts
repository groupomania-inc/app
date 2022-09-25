import { createRouter } from "../context";

export default createRouter().query("me", {
    resolve: ({ ctx }) => {
        return ctx.session?.user;
    },
});
