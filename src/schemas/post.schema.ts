import z from "zod";

export const createPostSchema = z.object({
    title: z
        .string({ required_error: "Le champ titre est requis" })
        .min(1, "Le champ titre est requis")
        .min(4, "Le titre doit faire au minimum 4 caractères")
        .max(32, "Le titre ne peut pas faire plus de 32 caractères"),
    body: z
        .string({ required_error: "Le champ titre est requis" })
        .min(1, "Le champ texte est requis")
        .max(1024, "Le texte ne peut pas faire plus de 1024 caractères"),
});
export type CreatePostInput = z.TypeOf<typeof createPostSchema>;

export const updatePostSchema = createPostSchema.extend({});
export type UpdatePostInput = z.TypeOf<typeof updatePostSchema>;

const postSchema = z.object({
    postId: z.string().uuid(),
});

export const getSinglePostSchema = postSchema.extend({});

export const likePostSchema = postSchema.extend({});

export const deletePostSchema = postSchema.extend({});
