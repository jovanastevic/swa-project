import { DB } from "../../src/middleware/db"; // Pfad anpassen

export async function clearTestDatabase() {
    // 1. Hole eine direkte Verbindung aus dem Pool
    const connection = await DB.getConnection();

    try {
        // 2. SEHR WICHTIG: Fremdschlüssel-Prüfungen deaktivieren.
        // Sonst weigert sich MySQL, Tabellen zu leeren, die miteinander verknüpft sind.
        await connection.query('SET FOREIGN_KEY_CHECKS = 0;');

        // 3. Finde alle Tabellen in der aktuellen (Test-)Datenbank
        const [tables] = await connection.query(`
            SELECT table_name
            FROM information_schema.tables
            WHERE table_schema = DATABASE()
        `);

        // 4. Leere jede gefundene Tabelle
        for (const row of (tables as any[])) {
            // In row.table_name oder row.TABLE_NAME steht der Name der Tabelle
            const tableName = row.table_name || row.TABLE_NAME;

            // --- HIER IST DIE ANPASSUNG ---
            // Wenn die Tabelle "catagory" heißt, überspringe das Leeren
            if (tableName === 'catagory') {
                continue;
            }

            await connection.query(`TRUNCATE TABLE \`${tableName}\`;`);
        }

        // 5. Fremdschlüssel-Prüfungen wieder aktivieren (Sicherheit geht vor)
        await connection.query('SET FOREIGN_KEY_CHECKS = 1;');

    } catch (error) {
        console.error("Fehler beim Leeren der Test-Datenbank:", error);
    } finally {
        // 6. Verbindung wieder an den Pool zurückgeben
        connection.release();
    }
}