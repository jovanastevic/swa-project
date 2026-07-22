import { describe, it, expect, beforeEach, afterAll } from '@jest/globals';
import request from 'supertest';
import { app } from '../src';
import { DB } from '../src/middleware/db';
import { clearDatabase, seedCategory } from './test-utils';

describe('GET /category', () => {
    beforeEach(async () => {
        await clearDatabase();
    });

    afterAll(async () => {
        await DB.end();
    });

    it('returns empty array when no categories exist', async () => {
        const res = await request(app).get('/category');
        expect(res.status).toBe(200);
        expect(res.body).toEqual([]);
    });

    it('returns all categories', async () => {
        await seedCategory(1, 'Coding', 'Coding related prompts');
        await seedCategory(2, 'Writing', 'Writing related prompts');
        const res = await request(app).get('/category');
        expect(res.status).toBe(200);
        expect(res.body).toHaveLength(2);
        expect(res.body[0]).toMatchObject({ category_id: 1, title: 'Coding', description: 'Coding related prompts' });
    });
});