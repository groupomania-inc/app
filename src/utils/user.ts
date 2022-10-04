import { User } from "@prisma/client";

import { env } from "../env/client.mjs";

export const formatUsername = (user: User) => `@${user.username}`;

export const formatDisplayName = (user: User) =>
    user.displayName && user.displayName.length > 0 ? user.displayName : user.username;

export const getProfilePicture = (user: User | undefined) =>
    user?.profilePicture ?? env.NEXT_PUBLIC_CLOUDINARY_DEFAULT_PROFILE_PICTURE;
