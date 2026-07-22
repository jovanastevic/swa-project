import {z} from "zod";

export const ChatroomOverview = z.object({
    chat_id: z.number(),
    chatroom_time_stamp: z.date().or(z.string()),
    prompt_id: z.number(),
    prompt_title: z.string(),
    prompt_description: z.string(),
    category_title: z.string(),
})

export const ChatroomId = z.object({
    chat_id: z.number()
})

export const UserChatMessage = z.object({
    username: z.string(),
    message: z.string().nullable(),
    time_stamp: z.date().or(z.string())
})

export type IChatroomOverview = z.infer<typeof ChatroomOverview>;
export type IChatroomId = z.infer<typeof ChatroomId>;
export type IUserChatMessage = z.infer<typeof UserChatMessage>;