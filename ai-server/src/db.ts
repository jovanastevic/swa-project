import mysql from "mysql2/promise";

export const DB = mysql.createPool({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT!),
    database: process.env.DB_DB,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
});