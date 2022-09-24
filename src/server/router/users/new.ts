import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { TRPCError } from "@trpc/server";
import { hash } from "argon2";

import { signUpSchema } from "../../../schemas/auth.schema";
import { createRouter } from "../context";

export default createRouter().mutation("new", {
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
                        message: "Un utilisateur avec cet email existe déjà",
                    });

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Quelque chose s'est mal passé...",
            });
        }
    },
});
