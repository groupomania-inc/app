import { TRPCError } from "@trpc/server";

import { createRouter } from "../context";
import deletePost from "./delete";
import getAllPosts from "./getAll";
import getSinglePost from "./getSingle";
import likePost from "./like";
import newPost from "./new";
import updatePost from "./update";

export const postsRouter = createRouter()
    .middleware(async ({ ctx, next }) => {
        if (!ctx.session?.user)
            throw new TRPCError({
                code: "FORBIDDEN",
                message: "Can't create a post while logged out",
            });

        return next();
    })
    .merge(deletePost)
    .merge(getAllPosts)
    .merge(getSinglePost)
    .merge(likePost)
    .merge(updatePost)
    .merge(newPost);

export default postsRouter;
