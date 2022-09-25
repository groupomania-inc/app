import * as z from "zod";

export const signInSchema = z.object({
    email: z
        .string()
        .min(1, "Le champ email est requis")
        .regex(
            /^(?!\.)[\w\-_.]*[^.]@groupomania\.com$/,
            "Le champ email doit être au format email@groupomania.com",
        ),
    password: z
        .string()
        .min(1, "Le champ mot de passe est requis")
        .min(4, "Le mot de passe doit faire minimum 4 caractères")
        .max(16, "Le mot de passe doit faire maximum 16 caractères"),
});

export const signUpSchema = signInSchema
    .extend({
        confirm: z.string().min(1, "Le champ confirmation mot de passe est requis"),
    })
    .refine((x) => x.password === x.confirm, {
        message: "Les mots de passes ne correspondent pas",
        path: ["confirm"],
    });

export type SignInInput = z.infer<typeof signInSchema>;
export type SignUpInput = z.infer<typeof signUpSchema>;
