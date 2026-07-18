import {z} from 'zod';

export const Prompt = z.object({
    prompt_id: z.number(),
    category_id: z.number(),
    username: z.string(),
    title: z.string(),
    description: z.string(),
    time_stamp: z.date().or(z.string()),
})

export const NewPrompt = z.object({
    category_id: z.number(),
    title: z.string(),
    description: z.string(),
})


export type IPrompt = z.infer<typeof Prompt>;
export type INewPrompt = z.infer<typeof NewPrompt>;