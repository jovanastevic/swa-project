import { describe, it, expect, beforeAll, beforeEach, afterAll } from '@jest/globals';
import request from 'supertest';
import WebSocket from 'ws';
import { app, server } from '../src';
import { DB } from '../src/middleware/db';
import { clearDatabase, seedCategory, registerAndLogin } from './test-utils';

let wsUrl: string;

async function setupChatroom(): Promise<number> {
    const creatorAgent = request.agent(app);
    await registerAndLogin(creatorAgent, 'creator', 'secret123', 'creator@test.com');
    await creatorAgent.post('/prompt').send({ category_id: 1, title: 'Prompt', description: 'Desc' });
    const prompts = await request(app).get('/prompt');
    const promptId = prompts.body[0].prompt_id as number;

    const memberAgent = request.agent(app);
    await registerAndLogin(memberAgent, 'member', 'secret123', 'member@test.com');
    const joined = await memberAgent.post(`/chat/join/${promptId}`);
    return joined.body.chat_id as number;
}

function connect(): Promise<WebSocket> {
    return new Promise((resolve, reject) => {
        const ws = new WebSocket(wsUrl);
        ws.once('open', () => resolve(ws));
        ws.once('error', reject);
    });
}

function nextMessage(ws: WebSocket): Promise<any> {
    return new Promise((resolve) => {
        ws.once('message', (data) => resolve(JSON.parse(data.toString())));
    });
}

function wait(ms: number) {
    return new Promise((r) => setTimeout(r, ms));
}

describe('WsController', () => {
    beforeAll((done) => {
        server.listen(0, () => {
            const port = (server.address() as any).port;
            wsUrl = `ws://localhost:${port}`;
            done();
        });
    });

    afterAll(async () => {
        server.close();
        await DB.end();
    });

    beforeEach(async () => {
        await clearDatabase();
        await seedCategory(1, 'Coding', 'Coding related prompts');
    });

    it('rejects join for a non-member', async () => {
        const chatId = await setupChatroom();
        const ws = await connect();
        ws.send(JSON.stringify({ event: 'join', chat_id: chatId, username: 'outsider'}));
        const res = await nextMessage(ws);
        expect(res).toMatchObject({ event: 'error', data: { message: 'You are not allowed' } });
        ws.close();
    });

    it('delivers messages only to members of the same chatroom', async () => {
        const chatId = await setupChatroom();
        const memberWs = await connect();
        const creatorWs = await connect();
        memberWs.send(JSON.stringify({ event: 'join', chat_id: chatId, username: 'member' }));
        creatorWs.send(JSON.stringify({ event: 'join', chat_id: chatId, username: 'creator' }));
        await wait(100);

        const incoming = nextMessage(creatorWs);
        memberWs.send(JSON.stringify({ event: 'message', chat_id: chatId, username: 'member', message: 'Hallo' }));
        const res = await incoming;

        expect(res.event).toBe('message');
        expect(res.data).toMatchObject({ username: 'member', message: 'Hallo' });
        memberWs.close();
        creatorWs.close();
    });

    it('broadcasts typing events to other members', async () => {
        const chatId = await setupChatroom();
        const memberWs = await connect();
        const creatorWs = await connect();
        memberWs.send(JSON.stringify({ event: 'join', chat_id: chatId, username: 'member' }));
        creatorWs.send(JSON.stringify({ event: 'join', chat_id: chatId, username: 'creator' }));
        await wait(100);

        const incoming = nextMessage(creatorWs);
        memberWs.send(JSON.stringify({ event: 'startTyping', chat_id: chatId, username: 'member' }));
        const res = await incoming;

        expect(res).toMatchObject({ event: 'startTyping', data: { username: 'member' } });
        memberWs.close();
        creatorWs.close();
    });

    it('rejects an invalid payload schema', async () => {
        const ws = await connect();
        ws.send(JSON.stringify({ foo: 'bar' }));
        const res = await nextMessage(ws);
        expect(res).toMatchObject({ event: 'error', data: { message: 'Invalid payload format' } });
        ws.close();
    });

    it('rejects malformed JSON', async () => {
        const ws = await connect();
        ws.send('not json');
        const res = await nextMessage(ws);
        expect(res).toMatchObject({ event: 'error', data: { message: 'Malformed JSON' } });
        ws.close();
    });

    it('does not persist a null message', async () => {
        const chatId = await setupChatroom();
        const ws = await connect();
        ws.send(JSON.stringify({ event: 'join', chat_id: chatId, username: 'member' }));
        await wait(100);
        ws.send(JSON.stringify({ event: 'message', chat_id: chatId, username: 'member', message: null }));
        await wait(100);

        const [rows]: any = await DB.query('SELECT * FROM chat_messages WHERE chat_id = ?', [chatId]);
        expect(rows).toHaveLength(0);
        ws.close();
    });
});