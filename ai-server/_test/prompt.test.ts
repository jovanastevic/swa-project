import request from 'supertest';
import { app } from '../src';
import { DB } from '../src/middleware/db';
import { clearTestDatabase } from './testUtils/dbCleanUp';
import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import jwt from 'jsonwebtoken';

let validAuthCookie: string;
let testCategoryId: number;
let createdPromptId: number;

describe('Prompt Flow Integration Tests', () => {

    beforeAll(async () => {
        // 1. Datenbank leeren
        await clearTestDatabase();

        // 2. Test-User direkt in die DB einfügen
        await DB.execute(
            'INSERT INTO user(username, password, email) VALUES(?, ?, ?)',
            ['PromptTester', 'hashedpassword123', 'tester@test.com']
        );

        // 3. Auth-Cookie generieren (Simuliert den Login für diesen User)
        const token = jwt.sign(
            { username: 'PromptTester', role: 'user' },
            process.env.JWT_SECRET || 'testsecret',
            { expiresIn: '15m' }
        );
        validAuthCookie = `accessToken=${token};`;

        // 4. Test-Kategorie erstellen
        const [catResult] = await DB.execute(
            'INSERT INTO category(name, description) VALUES(?, ?)',
            ['Test Kategorie', 'Eine Kategorie für Tests']
        );
        testCategoryId = (catResult as any).insertId;
    });

    afterAll(async () => {
        await DB.end();
    });

    // --- 1. POST /prompts ---
    describe('POST /prompts', () => {
        it('1. sollte einen neuen Prompt erfolgreich erstellen (Status 201)', async () => {
            const response = await request(app)
                .post('/prompts')
                .set('Cookie', validAuthCookie)
                .send({
                    category_id: testCategoryId,
                    title: 'Mein erster Test-Prompt',
                    description: 'Das ist eine Testbeschreibung für den Prompt.'
                });

            expect(response.status).toBe(201);
        });

        it('2. sollte bei fehlenden/falschen Eingabedaten abweisen (Status 400)', async () => {
            const response = await request(app)
                .post('/prompts')
                .set('Cookie', validAuthCookie)
                .send({
                    category_id: testCategoryId,
                    description: 'Beschreibung ohne Titel'
                });

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Missing or invalid fields');
            expect(response.body.errors).toBeDefined();
        });

        it('3. sollte fehlschlagen, wenn die Kategorie nicht existiert (Status 400)', async () => {
            const response = await request(app)
                .post('/prompts')
                .set('Cookie', validAuthCookie)
                .send({
                    category_id: 999999,
                    title: 'Guter Titel',
                    description: 'Gute Beschreibung'
                });

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Failed to create prompt or Catagory does not exist');
        });

        it('4. sollte ohne Authentifizierung blockiert werden', async () => {
            const response = await request(app)
                .post('/prompts')
                .send({
                    category_id: testCategoryId,
                    title: 'Hacker Prompt',
                    description: 'Ich bin nicht eingeloggt'
                });

            expect(response.status).toBeGreaterThanOrEqual(401);
            expect(response.status).toBeLessThanOrEqual(403);
        });
    });

    // --- 2. GET /prompts ---
    describe('GET /prompts', () => {
        it('5. sollte alle Prompts als Array zurückgeben (Status 200)', async () => {
            const response = await request(app)
                .get('/prompts');

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBeGreaterThan(0);

            createdPromptId = response.body[0].prompt_id;
        });
    });

    // --- 3. GET /prompts/:id ---
    describe('GET /prompts/:id', () => {
        it('6. sollte einen spezifischen Prompt anhand der ID zurückgeben (Status 200)', async () => {
            const response = await request(app)
                .get(`/prompts/${createdPromptId}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('prompt_id', createdPromptId);
            expect(response.body).toHaveProperty('title', 'Mein erster Test-Prompt');
        });

        it('7. sollte einen 404 Fehler werfen, wenn der Prompt nicht existiert', async () => {
            const response = await request(app)
                .get('/prompts/999999');

            expect(response.status).toBe(404);
            expect(response.body.message).toBe('Prompt with ID 999999 not found');
        });

        // HIER IST DIE ANPASSUNG FÜR DEN NEUEN CONTROLLER-CODE
        it('8. sollte einen 400 Fehler werfen, wenn die ID ungültig ist (z.B. Buchstaben)', async () => {
            const response = await request(app)
                .get('/prompts/ungueltige_id');

            expect(response.status).toBe(400);
            expect(response.body.message).toBe("Invalid prompt id");
        });
    });
});