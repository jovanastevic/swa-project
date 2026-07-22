import { describe, it, expect, beforeEach, afterAll } from '@jest/globals';
import { WsService } from '../src/service/WsService';
import { DB } from '../src/middleware/db';
import { clearDatabase, seedCategory, seedUser } from './test-utils';

async function seedChatroom(promptId: number, categoryId = 1, creator = 'creator') {
    await DB.execute(
        'INSERT INTO prompts (prompt_id, category_id, username, title, description) VALUES (?, ?, ?, ?, ?)',
        [promptId, categoryId, creator, 'Prompt', 'Desc']
    );
    const [insert]: any = await DB.execute('INSERT INTO chatroom (prompt_id) VALUES (?)', [promptId]);
    return insert.insertId as number;
}

describe('WsService', () => {
    beforeEach(async () => {
        await clearDatabase();
        await seedCategory(1, 'Coding', 'Coding related prompts');
        await seedUser('creator', 'secret123', 'creator@test.com');
        await seedUser('member', 'secret123', 'member@test.com');
        await seedUser('outsider', 'secret123', 'outsider@test.com');
    });

    afterAll(async () => {
        await DB.end();
    });

    describe('isUserInRoom', () => {
        it('returns true for a chat member', async () => {
            const chatId = await seedChatroom(1);
            await DB.execute('INSERT INTO chat_member (chat_id, username) VALUES (?, ?)', [chatId, 'member']);
            expect(await WsService.isUserInRoom('member', chatId)).toBe(true);
        });

        it('returns false for a non-member', async () => {
            const chatId = await seedChatroom(1);
            expect(await WsService.isUserInRoom('outsider', chatId)).toBe(false);
        });

        it('returns false for a non-existing chatroom', async () => {
            expect(await WsService.isUserInRoom('member', 9999)).toBe(false);
        });
    });

    describe('newMessage', () => {
        it('saves a message and returns true', async () => {
            const chatId = await seedChatroom(1);
            await DB.execute('INSERT INTO chat_member (chat_id, username) VALUES (?, ?)', [chatId, 'member']);
            const result = await WsService.newMessage({ chat_id: chatId, username: 'member', message: 'Hallo' });
            expect(result).toBe(true);

            const [rows]: any = await DB.query('SELECT * FROM chat_messages WHERE chat_id = ?', [chatId]);
            expect(rows).toHaveLength(1);
            expect(rows[0].message).toBe('Hallo');
        });

        it('throws for a non-existing chatroom (FK violation)', async () => {
            await expect(
                WsService.newMessage({ chat_id: 9999, username: 'member', message: 'Hallo' })
            ).rejects.toThrow();
        });
    });
});