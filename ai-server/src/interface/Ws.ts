import { z } from 'zod';

export const NewChatMessage = z.object({
    chat_id: z.number(),
    username: z.string(),
    message: z.string(),
});

export const WSChatMessage = z.object({
    chat_id: z.number(),
    username: z.string(),
    message: z.string(),
    time_stamp: z.date().or(z.string()),
});

export const WSEventSchema = z.object({
    event: z.enum(['join', 'startTyping', 'stopTyping', 'message']),
    chat_id: z.number(),
    username: z.string(),
    message: z.string().optional()
});

export type INewChatMessage = z.infer<typeof NewChatMessage>;
export type IWSChatMessage = z.infer<typeof WSChatMessage>;