import { describe, it, expect, beforeEach, afterAll } from '@jest/globals';
import request from 'supertest';
import { app } from '../src';
import { DB } from '../src/middleware/db';
import { clearDatabase } from './test-utils';

describe('Auth', () => {
    beforeEach(async () => {
        await clearDatabase();
    });

    afterAll(async () => {
        await DB.end();
    });

    describe('POST /register', () => {
        it('creates a new user', async () => {
            const res = await request(app).post('/register').send({
                username: 'alice', password: 'secret123', email: 'alice@test.com', profile_description: null
            });
            expect(res.status).toBe(201);
        });

        it('rejects invalid email', async () => {
            const res = await request(app).post('/register').send({
                username: 'alice', password: 'secret123', email: 'not-an-email', profile_description: null
            });
            expect(res.status).toBe(400);
        });

        it('rejects missing password', async () => {
            const res = await request(app).post('/register').send({
                username: 'alice', email: 'alice@test.com', profile_description: null
            });
            expect(res.status).toBe(400);
        });

        it('rejects duplicate username', async () => {
            const payload = { username: 'alice', password: 'secret123', email: 'alice@test.com', profile_description: null };
            await request(app).post('/register').send(payload);
            const res = await request(app).post('/register').send(payload);
            expect(res.status).toBe(409);
        });
    });

    describe('POST /login', () => {
        beforeEach(async () => {
            await request(app).post('/register').send({
                username: 'bob', password: 'secret123', email: 'bob@test.com', profile_description: null
            });
        });

        it('logs in with valid credentials and sets cookies', async () => {
            const res = await request(app).post('/login').send({ username: 'bob', password: 'secret123' });
            expect(res.status).toBe(200);
            expect(res.body.username).toBe('bob');
            const cookies = res.headers['set-cookie'] as unknown as string[];
            expect(cookies.some(c => c.startsWith('accessToken='))).toBe(true);
            expect(cookies.some(c => c.startsWith('refreshToken='))).toBe(true);
        });

        it('rejects wrong password', async () => {
            const res = await request(app).post('/login').send({ username: 'bob', password: 'wrong' });
            expect(res.status).toBe(401);
        });

        it('rejects unknown username', async () => {
            const res = await request(app).post('/login').send({ username: 'ghost', password: 'secret123' });
            expect(res.status).toBe(401);
        });

        it('rejects invalid body', async () => {
            const res = await request(app).post('/login').send({ username: 'bob' });
            expect(res.status).toBe(400);
        });
    });

    describe('POST /refresh', () => {
        it('rejects missing refresh token', async () => {
            const res = await request(app).post('/refresh');
            expect(res.status).toBe(401);
        });

        it('issues a new access token with valid refresh token', async () => {
            await request(app).post('/register').send({
                username: 'carol', password: 'secret123', email: 'carol@test.com', profile_description: null
            });
            const loginRes = await request(app).post('/login').send({ username: 'carol', password: 'secret123' });
            const cookies = loginRes.headers['set-cookie'] as unknown as string[];
            const refreshCookie = cookies.find(c => c.startsWith('refreshToken='))!.split(';')[0];

            const res = await request(app).post('/refresh').set('Cookie', [refreshCookie]);
            expect(res.status).toBe(200);
        });

        it('rejects invalid refresh token', async () => {
            const res = await request(app).post('/refresh').set('Cookie', ['refreshToken=invalid.token.value']);
            expect(res.status).toBe(401);
        });
    });

    describe('POST /logout', () => {
        it('clears auth cookies', async () => {
            const res = await request(app).post('/logout');
            expect(res.status).toBe(200);
            const cookies = res.headers['set-cookie'] as unknown as string[];
            expect(cookies.some(c => c.startsWith('accessToken=;'))).toBe(true);
            expect(cookies.some(c => c.startsWith('refreshToken=;'))).toBe(true);
        });
    });
});