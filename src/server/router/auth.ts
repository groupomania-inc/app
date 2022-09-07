import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { TRPCError } from "@trpc/server";
import { hash, verify } from "argon2";

import { signInSchema, signUpSchema } from "../../schemas/auth";
import { createRouter } from "./context";

export const authRouter = createRouter()
    .mutation("signup", {
        input: signUpSchema,
        resolve: async ({ input, ctx }) => {
            const { email, password } = input;

            try {
                const hashedPassword = await hash(password);

                const user = await ctx.prisma.user.create({
                    data: {
                        email,
                        password: hashedPassword,
                    },
                });

                return user;
            } catch (e) {
                if (e instanceof PrismaClientKnownRequestError)
                    if (e.code === "P2002")
                        throw new TRPCError({
                            code: "CONFLICT",
                            message: "A user with this email already exist",
                        });

                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Something went wrong...",
                });
            }
        },
    })
    .mutation("signin", {
        input: signInSchema,
        resolve: async ({ ctx, input }) => {
            const { email, password } = input;

            const user = await ctx.prisma.user.findFirst({
                where: { email },
            });

            if (!user || !(await verify(user.password, password)))
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "Invalid credentials",
                });

            return user;
        },
    });
