import { z } from "zod";

const MAX_FILE_SIZE = 5;

export const updateUserSchema = z.object({
    displayName: z.string().optional(),
    profilePicture: z.string().optional(),
});

export const updateUserFormSchema = updateUserSchema.extend({
    profilePicture: z
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

export type UpdateUserInput = z.TypeOf<typeof updateUserSchema>;
export type UpdateUserFormInput = z.TypeOf<typeof updateUserFormSchema>;
