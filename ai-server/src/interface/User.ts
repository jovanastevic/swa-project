import {z} from "zod";

export const User = z.object({
    username: z.string(),
    password: z.string(),
    email: z.email(),
    profile_description: z.string().nullable(),
});

export const UserData = z.object({
    username: z.string(),
    email: z.email(),
    profile_description: z.string().nullable(),
});

export const UserLogin = z.object({
    username: z.string(),
    password: z.string(),
});

export interface ITokenPayload {
    username : string;
}

export type IUser = z.infer<typeof User>;
export type IUserData = z.infer<typeof UserData>;
export type IUserLogin = z.infer<typeof UserLogin>;