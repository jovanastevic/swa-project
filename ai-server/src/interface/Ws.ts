import { z } from 'zod';

export const NewChatMessage = z.object({
    chat_id: z.number(),
    username: z.string(),
    message: z.string().nullable(),
});

export const WSChatMessage = z.object({
    chat_id: z.number(),
    username: z.string(),
    message: z.string().nullable(),
    time_stamp: z.date().or(z.string()),
});

export const WSEventSchema = z.object({
    event: z.enum(['join', 'startTyping', 'stopTyping', 'message']),
    chat_id: z.number(),
    username: z.string(),
    message: z.string().nullable().optional()
});

export type INewChatMessage = z.infer<typeof NewChatMessage>;
export type IWSChatMessage = z.infer<typeof WSChatMessage>;
export type IWSEvents = z.infer<typeof WSEventSchema>;