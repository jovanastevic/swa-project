import {Chatroom, IChatroom, INewChatroom, IRoomID, RoomID, ChatMessage, IChatMessage} from "../interface/Chat";
import {z} from "zod";
import {DB} from "../middleware/db";
import {ResultSetHeader, RowDataPacket} from "mysql2";

export class ChatRoomService{

    static async getUserChatrooms(username: string): Promise<IChatroom[]> {

        const [chatrooms] = await DB.query<RowDataPacket[]>(
            `SELECT r.* FROM chat_room r JOIN chat_member m ON r.chat_id = m.chat_id WHERE m.username = ?`,
                    [username]);

        if(!chatrooms || chatrooms.length === 0) {
            return [];
        }

        const parsed = z.array(Chatroom).safeParse(chatrooms);

        if (!parsed.success) {
            console.error("Zod Validierungsfehler bei getUserChatrooms:", JSON.stringify(parsed.error.issues, null, 2));
            throw new Error("Datenbank-Einträge entsprechen nicht dem Chatroom-Schema");
        }
        return parsed.data;
    }

    static async getChatroomById(chat_id: number): Promise<IChatroom| undefined> {
        const [rows] = await DB.query<RowDataPacket[]>(
            'select chat_id, prompt_id, time_stamp from chat_room where chat_id = ?',
            [chat_id]);
        if (!rows || rows.length === 0) {
            return undefined;
        }
        return Chatroom.safeParse(rows[0]).data;
    }

    static async getMessagesByChatId(chat_id: number): Promise<'error' | IChatMessage[] | undefined> {
        try {
            const [rows] = await DB.query<RowDataPacket[]>('select user_id, message, time_stamp from chat_messages where chat_id = ? order by time_stamp asc', [chat_id]);
            if (!rows || rows.length === 0) {
                return undefined;
            }
            return z.array(ChatMessage).safeParse(rows).data;
        }catch (e) {
            console.error(e);
            return 'error';
        }
    }

    static async JoinOrCreateChat(name: INewChatroom): Promise<undefined | 'error'| IRoomID > {
        try {
            const [result] = await DB.execute<ResultSetHeader>('insert into chat_room (name) values(?)', [name.name]);
            if(result.affectedRows > 1) return 'error';
            const [rows] = await DB.query<RowDataPacket[]>('select id from chat_room where name=?', [name.name])
            if (!rows || rows.length === 0) {
                return undefined;
            }
            return RoomID.safeParse(rows[0]).data;
        } catch (e) {
            console.error(e);
            return 'error';
        }
    }

    static async addUserToRoom(chatId: IRoomID, userId: string): Promise<'added' | 'error'> {
        try {
            await DB.execute('INSERT INTO chat_member (chat_id, user_id) VALUES (?, ?)', [chatId.id, userId]);
            return 'added';
        } catch (e) {
            console.error(e);
            return 'error';
        }
    }
}