import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// 1. Die richtige .env-Datei laden
if (process.env.NODE_ENV === 'test') {
    dotenv.config({ path: '.env.test' }); // Wir testen -> Lade Test-DB
} else {
    dotenv.config(); // Normaler Start -> Lade Entwicklungs-DB
}

// 2. Den Pool mit den geladenen Variablen erstellen
export const DB = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DB,
});