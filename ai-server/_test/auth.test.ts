import request from 'supertest';
import { app } from '../src';
import { DB } from '../src/middleware/db';
import { clearTestDatabase } from './testUtils/dbCleanUp';
import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';

const testUser = {
    username: "TestUser",
    password: "Password123!",
    email: "test@test.com",
    profile_description: "Das ist ein Testprofil"
};


let savedRefreshTokenCookie: string;

describe('Auth Flow Integration Tests', () => {

    // WICHTIG: beforeAll statt beforeEach!
    // Die Datenbank wird nur EINMAL vor dem allerersten Test geleert.
    beforeAll(async () => {
        // Umgebungsvariablen für die JWT-Secrets setzen (falls sie in der Test-Umgebung fehlen)
        // WICHTIG: Wenn du in deinem Controller das Secret beim Login nicht fixt,
        // mach hier beide Secrets vorerst identisch, sonst schlägt der Test fehl!

        await clearTestDatabase();
    });

    // Nach allen Tests die Datenbankverbindung kappen
    afterAll(async () => {
        await DB.end();
    });

    // --- 1. REGISTRIERUNG ---
    it('1. sollte einen neuen User erfolgreich registrieren (Status 201)', async () => {
        const response = await request(app)
            .post('/register')
            .send(testUser);

        expect(response.status).toBe(201);
    });

    it('2. sollte bei erneuter Registrierung des gleichen Users fehlschlagen (Status 409)', async () => {
        const response = await request(app)
            .post('/register')
            .send(testUser);

        expect(response.status).toBe(409);
    });

    // --- 2. LOGIN ---
    it('3. sollte sich mit dem erstellten User einloggen und Cookies setzen (Status 200)', async () => {
        const response = await request(app)
            .post('/login')
            .send({
                username: testUser.username,
                password: testUser.password
            });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Login erfolgreich');
        expect(response.body.username).toBe(testUser.username);

        // Cookies extrahieren
        const cookies = response.headers['set-cookie'] as unknown as string[];
        expect(cookies).toBeDefined();

        // Wir prüfen, ob accessToken und refreshToken gesetzt wurden
        const hasAccessToken = cookies.some((c: string) => c.includes('accessToken='));
        const hasRefreshToken = cookies.some((c: string) => c.includes('refreshToken='));

        expect(hasAccessToken).toBe(true);
        expect(hasRefreshToken).toBe(true);

        // Wir speichern den kompletten String des Refresh-Cookies für den nächsten Test
        // Test 3 anpassen:
        savedRefreshTokenCookie = cookies
            .find((c: string) => c.startsWith('refreshToken='))
            ?.split(';')[0] as string; // <--- Das split() ist neu!
    });

    it('4. sollte beim Login mit falschem Passwort abweisen (Status 401)', async () => {
        const response = await request(app)
            .post('/login')
            .send({
                username: testUser.username,
                password: "WrongPassword!"
            });

        expect(response.status).toBe(401);
    });

    // --- 3. REFRESH TOKEN ---
    it('5. sollte mit einem gültigen Refresh-Token ein neues Access-Token generieren', async () => {
        const response = await request(app)
            .post('/refresh')
            .set('Cookie', savedRefreshTokenCookie); // Hier hängen wir das gemerkte Cookie an!

        console.log("GRUND FÜR 401:", response.body);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Token refreshed successfully');

        // Prüfen, ob das NEUE Access-Token im Set-Cookie Header ist
        const cookies = response.headers['set-cookie'] as unknown as string[];
        expect(cookies).toBeDefined();
        const hasNewAccessToken = cookies.some((c: string) => c.includes('accessToken='));
        expect(hasNewAccessToken).toBe(true);
    });

    it('6. sollte Refresh ohne Token verweigern (Status 401)', async () => {
        const response = await request(app)
            .post('/refresh'); // Ohne .set('Cookie', ...)

        expect(response.status).toBe(401);
        expect(response.body.message).toBe('Refresh token required');
    });

    // --- 4. LOGOUT ---
    it('7. sollte den User ausloggen und Cookies leeren (Status 200)', async () => {
        const response = await request(app)
            .post('/logout');

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Logged out successfully');

        // Checken ob express.clearCookie() richtig aufgerufen wurde.
        // Express leert Cookies, indem das Ablaufdatum in die Vergangenheit gesetzt wird (bzw. leerer Wert)
        const cookies = response.headers['set-cookie'] as unknown as string[];
        expect(cookies).toBeDefined();

        const clearedAccessToken = cookies.some((c: string) => c.includes('accessToken=;') && c.includes('Expires='));
        const clearedRefreshToken = cookies.some((c: string) => c.includes('refreshToken=;') && c.includes('Expires='));

        expect(clearedAccessToken).toBe(true);
        expect(clearedRefreshToken).toBe(true);
    });
});