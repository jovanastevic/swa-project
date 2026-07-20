import { describe, it, expect, beforeEach, afterAll } from '@jest/globals';
import request from 'supertest';
import { app } from '../src';
import { DB } from '../src/middleware/db';
import { clearDatabase, seedCategory, registerAndLogin } from './test-utils';

describe('Prompts', () => {
    beforeEach(async () => {
        await clearDatabase();
        await seedCategory(1, 'Coding', 'Coding related prompts');
    });

    afterAll(async () => {
        await DB.end();
    });

    describe('GET /prompts', () => {
        it('returns empty array when no prompts exist', async () => {
            const res = await request(app).get('/prompts');
            expect(res.status).toBe(200);
            expect(res.body).toEqual([]);
        });
    });

    describe('GET /prompts/:id', () => {
        it('rejects non-numeric id', async () => {
            const res = await request(app).get('/prompts/abc');
            expect(res.status).toBe(400);
        });

        it('returns 404 for non-existing prompt', async () => {
            const res = await request(app).get('/prompts/999');
            expect(res.status).toBe(404);
        });
    });

    describe('POST /prompts', () => {
        it('rejects unauthenticated requests', async () => {
            const res = await request(app).post('/prompts').send({ category_id: 1, title: 'Test', description: 'Desc' });
            expect(res.status).toBe(401);
        });

        it('creates a prompt for an authenticated user', async () => {
            const agent = request.agent(app);
            await registerAndLogin(agent, 'dave', 'secret123', 'dave@test.com');
            const res = await agent.post('/prompts').send({ category_id: 1, title: 'Test Prompt', description: 'Test Description' });
            expect(res.status).toBe(201);

            const list = await request(app).get('/prompts');
            expect(list.body).toHaveLength(1);
            expect(list.body[0]).toMatchObject({ title: 'Test Prompt', username: 'dave' });
        });

        it('rejects invalid body', async () => {
            const agent = request.agent(app);
            await registerAndLogin(agent, 'erin', 'secret123', 'erin@test.com');
            const res = await agent.post('/prompts').send({ title: 'Missing fields' });
            expect(res.status).toBe(400);
        });

        it('rejects non-existing category', async () => {
            const agent = request.agent(app);
            await registerAndLogin(agent, 'frank', 'secret123', 'frank@test.com');
            const res = await agent.post('/prompts').send({ category_id: 999, title: 'Test', description: 'Desc' });
            expect(res.status).toBe(400);
        });
    });
});