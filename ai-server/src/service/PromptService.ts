import {DB} from "../middleware/db";
import {z} from "zod";
import {ResultSetHeader, RowDataPacket} from "mysql2";
import {INewPrompt, IPrompt, Prompt} from "../interface/Prompt";

export class PromptService {
    static async getAllPrompts(): Promise<IPrompt[]> {
        const [prompts] = await DB.query<RowDataPacket[]>(
            'select p.prompt_id, c.name, p.username, p.title, p.description, p.time_stamp from prompts p join category c on c.category_id = p.category_id');

        const parsed = z.array(Prompt).safeParse(prompts);

        if (!parsed.success) {
            console.error("Zod Validierungsfehler bei getAllPrompts:", z.treeifyError(parsed.error));
            throw new Error("Datenbank-Einträge entsprechen nicht dem Prompt-Schema");
        }
        return parsed.data;
    }

    static async getPromptById(Id: number): Promise< undefined | IPrompt> {
        const [rows] = await DB.query<RowDataPacket[]>(
            'select p.prompt_id, c.name, p.username, p.title, p.description, p.time_stamp from prompts p join category c on c.category_id = p.category_id WHERE p.prompt_id = ?',
                    [Id]);
        if (!rows || rows.length === 0) {
            return undefined;
        }
        const parsed = Prompt.safeParse(rows[0]);

        if (!parsed.success) {
            console.error("Zod Validierungsfehler bei getPromptById:", z.treeifyError(parsed.error));
            throw new Error("Prompt mit ID ${id} konnte nicht validiert werden.");
        }
        return parsed.data;
    }

    static async createPrompt(data: INewPrompt, username:string): Promise<boolean> {
        const [insert] = await DB.execute<ResultSetHeader>(
            'insert into prompts (category_id, username, title, description) values (?, ?, ?, ?)',
                    [data.category_id, username, data.title, data.description]);

        return insert.affectedRows < 1;
    }
}