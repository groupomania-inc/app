import z from "zod";

const postSchema = z.object({
    postId: z.string().uuid(),
});

export const createPostSchema = z.object({
    body: z
        .string({ required_error: "Le champ titre est requis" })
        .min(1, "Le champ texte est requis")
        .max(1024, "Le texte ne peut pas faire plus de 1024 caractères"),
});
export type CreatePostInput = z.TypeOf<typeof createPostSchema>;

export const updatePostSchema = createPostSchema.extend(postSchema.shape);
export type UpdatePostInput = z.TypeOf<typeof updatePostSchema>;

export const getSinglePostSchema = postSchema.extend({});

export const likePostSchema = postSchema.extend({});

export const deletePostSchema = postSchema.extend({});
