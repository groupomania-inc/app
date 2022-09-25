import { User } from "@prisma/client";

export const formatUsername = (user: User) => `@${user.username}`;

export const formatDisplayName = (user: User) =>
    user.displayName && user.displayName.length > 0 ? user.displayName : user.username;

export const getProfilePicture = (user: User | undefined) =>
    user?.profilePicture ??
    "https://res.cloudinary.com/stevancorre/image/upload/v1664060971/default-user.jpg";
