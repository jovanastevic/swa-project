import {z} from "zod";

export const User = z.object({
    username: z.string(),
    password: z.string(),
    email: z.email(),
    profile_description: z.string().or(z.null()),
});

export const UserData = z.object({
    username: z.string(),
    email: z.email(),
    profile_description: z.string(),
});

export const UserLogin = z.object({
    username: z.string(),
    password: z.string(),
});

export type IUser = z.infer<typeof User>;
export type IUserData = z.infer<typeof UserData>;
export type IUserLogin = z.infer<typeof UserLogin>;