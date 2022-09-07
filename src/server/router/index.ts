// src/server/router/index.ts
import superjson from "superjson";

import { createRouter } from "./context";
import { usersRouter } from "./user.router";

export const appRouter = createRouter().transformer(superjson).merge("users.", usersRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
