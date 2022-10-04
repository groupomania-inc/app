// @ts-check
import { z } from "zod";

/**
 * Specify your server-side environment variables schema here.
 * This way you can ensure the app isn't built with invalid env vars.
 */
export const serverSchema = z.object({
    DATABASE_URL: z.string().url(),
    NODE_ENV: z.enum(["development", "test", "production"]),
    NEXTAUTH_SECRET: z.string(),
    NEXTAUTH_URL: z.string().url(),
});

/**
 * Specify your client-side environment variables schema here.
 * This way you can ensure the app isn't built with invalid env vars.
 * To expose them to the client, prefix them with `NEXT_PUBLIC_`.
 */
export const clientSchema = z.object({
    NEXT_PUBLIC_MAXIMUM_UPLOAD_SIZE: z.string(),
    NEXT_PUBLIC_CLOUDINARY_URL: z.string(),
    NEXT_PUBLIC_CLOUDINARY_POST_PRESET: z.string(),
    NEXT_PUBLIC_CLOUDINARY_PROFILE_PICTURE_PRESET: z.string(),
    NEXT_PUBLIC_CLOUDINARY_DEFAULT_PROFILE_PICTURE: z.string(),
});

/**
 * You can't destruct `process.env` as a regular object, so you have to do
 * it manually here. This is because Next.js evaluates this at build time,
 * and only used environment variables are included in the build.
 * @type {{ [k in keyof z.infer<typeof clientSchema>]: z.infer<typeof clientSchema>[k] | undefined }}
 */
export const clientEnv = {
    NEXT_PUBLIC_MAXIMUM_UPLOAD_SIZE: process.env.NEXT_PUBLIC_MAXIMUM_UPLOAD_SIZE,
    NEXT_PUBLIC_CLOUDINARY_URL: process.env.NEXT_PUBLIC_CLOUDINARY_URL,
    NEXT_PUBLIC_CLOUDINARY_POST_PRESET: process.env.NEXT_PUBLIC_CLOUDINARY_POST_PRESET,
    NEXT_PUBLIC_CLOUDINARY_PROFILE_PICTURE_PRESET: process.env.NEXT_PUBLIC_CLOUDINARY_PROFILE_PICTURE_PRESET,
    NEXT_PUBLIC_CLOUDINARY_DEFAULT_PROFILE_PICTURE:
        process.env.NEXT_PUBLIC_CLOUDINARY_DEFAULT_PROFILE_PICTURE,
};
