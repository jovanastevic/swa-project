import { z } from 'zod';

export const Category = z.object({
    id: z.number(),
    name: z.string().min(1).max(50),
    description: z.string(),
});

export type ICategory = z.infer<typeof Category>;