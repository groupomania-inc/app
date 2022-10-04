import z from "zod";

const MAX_FILE_SIZE = 5;

const postSchema = z.object({
    postId: z.string().uuid(),
});

export const createPostSchema = z.object({
    body: z
        .string({ required_error: "Le champ titre est requis" })
        .min(1, "Le champ texte est requis")
        .max(1024, "Le texte ne peut pas faire plus de 1024 caractères"),
    image: z.string().optional(),
});
export const createPostFormSchema = createPostSchema.extend({
    image: z
        .any()
        .refine(
            (files) => !files?.[0] || files?.[0]?.size <= MAX_FILE_SIZE * 1e6,
            `La taille maximum est ${MAX_FILE_SIZE}mb`,
        )
        .refine(
            (files) => !files?.[0] || files?.[0]?.type.startsWith("image/"),
            `Une image est attendue ${MAX_FILE_SIZE}`,
        )
        .optional(),
});
export type CreatePostInput = z.TypeOf<typeof createPostSchema>;
export type CreatePostFormInput = z.TypeOf<typeof createPostFormSchema>;

export const updatePostSchema = createPostSchema.extend(postSchema.shape);
export const updatePostFormSchema = createPostFormSchema.extend(postSchema.shape);
export type UpdatePostInput = z.TypeOf<typeof updatePostSchema>;
export type UpdatePostFormInput = z.TypeOf<typeof updatePostFormSchema>;

export const getSinglePostSchema = postSchema.extend({});

export const likePostSchema = postSchema.extend({});

export const deletePostSchema = postSchema.extend({});
