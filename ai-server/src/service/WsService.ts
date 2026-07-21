import { INewChatMessage } from "../interface/Ws";
import { DB } from "../middleware/db";
import { ResultSetHeader, RowDataPacket } from "mysql2";

export class WsService {
    static async isUserInRoom(username: string, chat_id: number): Promise<boolean> {
        const [rows] = await DB.query<RowDataPacket[]>(
            'select chat_id from chat_member where username = ? and chat_id = ?',
            [username, chat_id]
        );
        return rows && rows.length > 0;
    }

    static async newMessage(data: INewChatMessage): Promise<boolean> {
        const [insert] = await DB.execute<ResultSetHeader>(
            'insert into chat_messages(chat_id, username, message) values (?, ?, ?)',
                [data.chat_id, data.username, data.message]
        );
        return insert.affectedRows > 0;
    }
}