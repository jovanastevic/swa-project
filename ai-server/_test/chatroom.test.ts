import { describe, it, expect, beforeEach, afterAll } from '@jest/globals';
import request from 'supertest';
import { app } from '../src';
import { DB } from '../src/middleware/db';
import { clearDatabase, seedCategory, registerAndLogin } from './test-utils';

describe('Chatroom', () => {
    beforeEach(async () => {
        await clearDatabase();
        await seedCategory(1, 'Coding', 'Coding related prompts');
    });

    afterAll(async () => {
        await DB.end();
    });

    async function createPrompt(agent: ReturnType<typeof request.agent>): Promise<number> {
        await agent.post('/prompt').send({ category_id: 1, title: 'Sample Prompt', description: 'Sample Description' });
        const res = await request(app).get('/prompt');
        return res.body[0].prompt_id as number;
    }

    describe('GET /chat-overview', () => {
        it('rejects unauthenticated requests', async () => {
            const res = await request(app).get('/chat-overview');
            expect(res.status).toBe(401);
        });

        it('returns empty overview for a user without chatrooms', async () => {
            const agent = request.agent(app);
            await registerAndLogin(agent, 'gina', 'secret123', 'gina@test.com');
            const res = await agent.get('/chat-overview');
            expect(res.status).toBe(200);
            expect(res.body).toEqual([]);
        });
    });

    describe('POST /chat/join/:prompt_id', () => {
        it('rejects unauthenticated requests', async () => {
            const res = await request(app).post('/chat/join/1');
            expect(res.status).toBe(401);
        });

        it('rejects non-numeric prompt id', async () => {
            const agent = request.agent(app);
            await registerAndLogin(agent, 'hank', 'secret123', 'hank@test.com');
            const res = await agent.post('/chat/join/abc');
            expect(res.status).toBe(400);
        });

        it('returns 404 for non-existing prompt', async () => {
            const agent = request.agent(app);
            await registerAndLogin(agent, 'ivan', 'secret123', 'ivan@test.com');
            const res = await agent.post('/chat/join/999');
            expect(res.status).toBe(404);
        });

        it('creates a chatroom and joins creator and joiner', async () => {
            const creatorAgent = request.agent(app);
            await registerAndLogin(creatorAgent, 'judy', 'secret123', 'judy@test.com');
            const promptId = await createPrompt(creatorAgent);

            const joinerAgent = request.agent(app);
            await registerAndLogin(joinerAgent, 'kevin', 'secret123', 'kevin@test.com');
            const res = await joinerAgent.post(`/chat/join/${promptId}`);
            expect(res.status).toBe(201);
            expect(res.body).toHaveProperty('chat_id');

            const overview = await joinerAgent.get('/chat-overview');
            expect(overview.body).toHaveLength(1);
            expect(overview.body[0]).toMatchObject({ prompt_id: promptId });
        });

        it('reuses existing chatroom for the same prompt', async () => {
            const creatorAgent = request.agent(app);
            await registerAndLogin(creatorAgent, 'liam', 'secret123', 'liam@test.com');
            const promptId = await createPrompt(creatorAgent);

            const joinerAgent = request.agent(app);
            await registerAndLogin(joinerAgent, 'mia', 'secret123', 'mia@test.com');
            const first = await joinerAgent.post(`/chat/join/${promptId}`);

            const secondJoinerAgent = request.agent(app);
            await registerAndLogin(secondJoinerAgent, 'noah', 'secret123', 'noah@test.com');
            const second = await secondJoinerAgent.post(`/chat/join/${promptId}`);

            expect(second.body.chat_id).toBe(first.body.chat_id);
        });
    });

    describe('GET /chat/:id', () => {
        it('rejects unauthenticated requests', async () => {
            const res = await request(app).get('/chat/1');
            expect(res.status).toBe(401);
        });

        it('rejects non-numeric id', async () => {
            const agent = request.agent(app);
            await registerAndLogin(agent, 'oscar', 'secret123', 'oscar@test.com');
            const res = await agent.get('/chat/abc');
            expect(res.status).toBe(400);
        });

        it('returns empty array for a chatroom without messages', async () => {
            const creatorAgent = request.agent(app);
            await registerAndLogin(creatorAgent, 'peggy', 'secret123', 'peggy@test.com');
            const promptId = await createPrompt(creatorAgent);
            const joined = await creatorAgent.post(`/chat/join/${promptId}`);
            const chatId = joined.body.chat_id;

            const res = await creatorAgent.get(`/chat/${chatId}`);
            expect(res.status).toBe(200);
            expect(res.body).toEqual([]);
        });
    });
});