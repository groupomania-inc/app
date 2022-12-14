// src/server/router/index.ts
import superjson from "superjson";

import { createRouter } from "./context";
import postsRouter from "./posts";
import usersRouter from "./users";

export const appRouter = createRouter()
    .transformer(superjson)
    .merge("users.", usersRouter)
    .merge("posts.", postsRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
