import { z } from 'zod';

export const Category = z.object({
    category_id: z.number(),
    title: z.string().min(1).max(50),
    description: z.string(),
});

export type ICategory = z.infer<typeof Category>;