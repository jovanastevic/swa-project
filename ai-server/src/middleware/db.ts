import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// if the NODE_ENV is set to '_test', load the _test environment variables
// and connect to the _test database.
// the _test database is a blank copy of the original database.
if (process.env.NODE_ENV === 'test') {
    dotenv.config({ path: '.env._test' });
} else {
    dotenv.config();
}

export const DB = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DB,
});