import { hash } from 'bcrypt';
import { DB } from '../src/middleware/db';
import request from 'supertest';

export async function clearDatabase(): Promise<void> {
    await DB.query('SET FOREIGN_KEY_CHECKS = 0');
    await DB.query('TRUNCATE TABLE chat_messages');
    await DB.query('TRUNCATE TABLE chat_member');
    await DB.query('TRUNCATE TABLE chatroom');
    await DB.query('TRUNCATE TABLE prompts');
    await DB.query('TRUNCATE TABLE category');
    await DB.query('TRUNCATE TABLE user');
    await DB.query('SET FOREIGN_KEY_CHECKS = 1');
}

export async function seedCategory(id = 1, title = 'Coding', description = 'Coding related prompts'): Promise<void> {
    await DB.execute('INSERT INTO category (category_id, title, description) VALUES (?, ?, ?)', [id, title, description]);
}

export async function seedUser(username = 'testuser', password = 'secret123', email = 'test@test.com'): Promise<void> {
    const hashed = await hash(password, 12);
    await DB.execute(
        'INSERT INTO user (username, password, email, profile_description) VALUES (?, ?, ?, ?)',
        [username, hashed, email, null]
    );
}

export async function registerAndLogin(
    agent: ReturnType<typeof request.agent>,
    username = 'testuser',
    password = 'secret123',
    email = 'test@test.com'
) {
    await agent.post('/register').send({ username, password, email, profile_description: null });
    return agent.post('/login').send({ username, password });
}