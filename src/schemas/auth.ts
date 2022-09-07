import * as z from "zod";

export const signInSchema = z.object({
    email: z.string().email(),
    password: z.string().min(4).max(16),
});

export const signUpSchema = signInSchema.extend({
    email: z.string().email(),
    password: z.string().min(4).max(16),
});

export type SignInInput = z.infer<typeof signInSchema>;
export type SignUpInput = z.infer<typeof signUpSchema>;
