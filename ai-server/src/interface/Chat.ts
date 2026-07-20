import {z} from "zod";

export const Chatroom = z.object({
    chat_id: z.number(),
    prompt_id: z.string(),
    time_stamp: z.date().or(z.string()),
})

export const NewChatroom = z.object({
    name: z.string(),
})

export const RoomID =  z.object({
    id: z.number(),
})

export type IChatroom = z.infer<typeof Chatroom>;
export type INewChatroom = z.infer<typeof NewChatroom>;
export type IRoomID = z.infer<typeof RoomID>;

// chat interfaces

export const ChatMessage = z.object({
    user_id: z.string(),
    message: z.string(),
    time_stamp: z.date().or(z.string()),
});

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

export type IChatMessage = z.infer<typeof ChatMessage>;
export type INewChatMessage = z.infer<typeof NewChatMessage>;
export type IWSChatMessage = z.infer<typeof WSChatMessage>;