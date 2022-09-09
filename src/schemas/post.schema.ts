import z from "zod";

export const createPostSchema = z.object({
    title: z.string().max(32, "Maximum title length is 32 characters"),
    body: z.string().max(1024, "Maximum body length is 1024 characters"),
});
export type CreatePostInput = z.TypeOf<typeof createPostSchema>;

const postSchema = z.object({
    postId: z.string().uuid(),
});

export const likePostSchema = postSchema.extend({});

export const deletePostSchema = postSchema.extend({});
