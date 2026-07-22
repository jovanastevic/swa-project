import {
    ChatroomOverview,
    IChatroomOverview,
    ChatroomId,
    IChatroomId,
    UserChatMessage,
    IUserChatMessage
} from "../interface/Chat";
import {z} from "zod";
import {DB} from "../middleware/db";
import {ResultSetHeader, RowDataPacket} from "mysql2";
import {PromptService} from "./PromptService";

export class ChatroomService{

    static async getUserChatrooms(username: string): Promise<IChatroomOverview[]> {

        const [chatrooms] = await DB.query<RowDataPacket[]>(
            `SELECT r.chat_id, r.time_stamp as chatroom_time_stamp, p.prompt_id ,p.title as prompt_title, p.description as prompt_description, c.title as category_title
                FROM chatroom r JOIN 
                    chat_member m ON 
                        r.chat_id = m.chat_id JOIN 
                    prompts p ON 
                        r.prompt_id = p.prompt_id JOIN 
                    category c ON 
                         p.category_id = c.category_id 
                WHERE m.username = ?`,
                            [username]);

        if(!chatrooms || chatrooms.length === 0) {
            return [];
        }

        const parsed = z.array(ChatroomOverview).safeParse(chatrooms);

        if (!parsed.success) {
            console.error("Zod Validierungsfehler bei getUserChatrooms:", JSON.stringify(parsed.error.issues, null, 2));
            throw new Error("Datenbank-Einträge entsprechen nicht dem Chatroom-Schema");
        }
        return parsed.data;
    }
    static async joinOrCreateChatroom(username: string, prompt_id: number): Promise<IChatroomId> {
        // Validate prompt_id
        const prompt = await PromptService.getPromptById(prompt_id);
        if (!prompt) {
            throw new Error(`Prompt mit ID ${prompt_id} nicht gefunden.`);
        }

        const promptCreator = prompt.username;

        // Check if a chatroom already exists for the given prompt_id
        const chatroomId = await this.getChatroomIdByPromptId(prompt_id);

        let finalChatroomId: number;

        if (!chatroomId) {
            // Chatroom doesn't exist
            finalChatroomId = await this.createChatroom(prompt_id);

            // Set for avoiding duplicates
            const firstChatUsers = Array.from(new Set([username, promptCreator]));

            for (const user of firstChatUsers) {
                await this.addUserToChatroom(user, finalChatroomId);
            }
        } else {
            // chatroom exists add the
            finalChatroomId = chatroomId;
            await this.addUserToChatroom(username, finalChatroomId);
        }

        // Validate with Zod so that the response is an Object
        const parsed = ChatroomId.safeParse({ chat_id: finalChatroomId });

        if (!parsed.success) {
            console.error("Zod Validierungsfehler bei JoinOrCreateChat:", JSON.stringify(parsed.error.issues, null, 2));
            throw new Error(`ChatroomId entspricht nicht dem IChatroomId-Schema`);
        }

        return parsed.data;
    }

    static async getChatroomIdByPromptId(prompt_id: number): Promise<number| undefined> {

        const [rows] = await DB.query<RowDataPacket[]>(
            `SELECT chat_id
                    from chatroom 
                    WHERE prompt_id = ?`,
                                [prompt_id]);

        if (!rows || rows.length === 0) {
            return undefined;
        }

       return rows[0].chat_id;
    }

    static async createChatroom(prompt_id: number): Promise<number> {
        const [insert] = await DB.execute<ResultSetHeader>(
            'INSERT INTO chatroom (prompt_id) VALUES (?)',
                    [prompt_id]);
            return insert.insertId;
    }

    static async addUserToChatroom(username: string, chatroom_id: number): Promise<boolean> {
        // IGNORE for avoiding that the user is already a member of the Chatroom
        await DB.execute<ResultSetHeader>(
            'INSERT IGNORE INTO chat_member (chat_id, username) VALUES (?, ?)',
            [chatroom_id, username]);

        return true;
    }

    static async getMessagesByChatId(chat_id: number): Promise<IUserChatMessage[]> {
        const [rows] = await DB.query<RowDataPacket[]>(
            `select username, message, time_stamp
             from chat_messages
             where chat_id = ?
             order by time_stamp `,
                    [chat_id]);

        if (!rows || rows.length === 0) {
            return [];
        }

        const parsed = z.array(UserChatMessage).safeParse(rows);

        if (!parsed.success) {
            console.error("Zod Validierungsfehler bei getMessagesByChatId:", JSON.stringify(parsed.error.issues, null, 2));
            throw new Error(`Chatmessages entsprechen nicht dem IChatMessages-Schema`);
        }

        return parsed.data;
    }
}