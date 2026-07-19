import request from 'supertest';
import { app } from '../src'; // Passe den Pfad zu deiner Express-App an
import { DB } from '../src/middleware/db';
import { clearTestDatabase } from './testUtils/dbCleanUp';
import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';

describe('Category Integration Tests', () => {

    beforeAll(async () => {
        // Datenbank vor den Tests komplett leeren
        await clearTestDatabase();
    });

    afterAll(async () => {
        // Datenbankverbindung nach den Tests schließen
        await DB.end();
    });

    describe('GET /category', () => {

        it('1. sollte ein leeres Array zurückgeben (Status 200), wenn keine Kategorien existieren', async () => {
            const response = await request(app)
                .get('/category');

            expect(response.status).toBe(200);

            // NEU: Wir erwarten jetzt explizit, dass die Antwort ein leeres Array ist
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body).toEqual([]);
            expect(response.body.length).toBe(0);
        });

        it('2. sollte alle Kategorien als Array zurückgeben, wenn Daten vorhanden sind (Status 200)', async () => {
            // 1. Arrange: Wir erstellen direkt über die DB eine Test-Kategorie
            await DB.execute(
                'INSERT INTO category (name, description) VALUES (?, ?)',
                ['Technologie', 'Alle Prompts rund um IT und Software']
            );

            // 2. Act: Wir rufen den Endpunkt auf
            const response = await request(app)
                .get('/category');

            // 3. Assert: Wir prüfen das Ergebnis
            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBeGreaterThan(0);

            // Wir prüfen, ob die eingefügten Daten korrekt gemappt wurden
            expect(response.body[0]).toHaveProperty('category_id');
            expect(response.body[0]).toHaveProperty('name', 'Technologie');
            expect(response.body[0]).toHaveProperty('description', 'Alle Prompts rund um IT und Software');
        });

    });
});