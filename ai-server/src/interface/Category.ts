import { z } from 'zod';

export const Category = z.object({
    category_id: z.number(),
    title: z.string(),
    description: z.string().nullable(),
});

export type ICategory = z.infer<typeof Category>;