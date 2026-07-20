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

export const ChatMessage = z.object({
    username: z.string(),
    message: z.string(),
    time_stamp: z.date().or(z.string())
})

export type IChatroomOverview = z.infer<typeof ChatroomOverview>;
export type IChatroomId = z.infer<typeof ChatroomId>;
export type IChatMessage = z.infer<typeof ChatMessage>;

export const NewChatroom = z.object({
    name: z.string(),
})

export const RoomID =  z.object({
    id: z.number(),
})

export type INewChatroom = z.infer<typeof NewChatroom>;
export type IRoomID = z.infer<typeof RoomID>;

// chat interfaces

export const NewChatMessage = z.object({
    chat_id: z.number(),
    user_id: z.string(),
    message: z.string().nullable(),
});

export const WSChatMessage = z.object({
    chat_id: z.number(),
    user_id: z.string(),
    message: z.string().nullable(),
    time_stamp: z.date().or(z.string()),
});

export interface IWSEvents {
    event: 'join' | 'startTyping' | 'stopTyping' | 'message';
    chat_id: number;
    user_id: string;
    message: string | null;
}
export type INewChatMessage = z.infer<typeof NewChatMessage>;
export type IWSChatMessage = z.infer<typeof WSChatMessage>;