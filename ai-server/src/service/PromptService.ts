import {DB} from "../middleware/db";
import {CategoryService} from "./CategoryService";
import {z} from "zod";
import {ResultSetHeader, RowDataPacket} from "mysql2";
import {INewPrompt, IPrompt, Prompt} from "../interface/Prompt";

export class PromptService {
    static async getAllPrompts(): Promise<IPrompt[]> {
        const [prompts] = await DB.query<RowDataPacket[]>(
            'select p.prompt_id, p.category_id, c.name, p.username, p.title, p.description, p.time_stamp from prompts p join category c on c.category_id = p.category_id');

        const parsed = z.array(Prompt).safeParse(prompts);

        if (!parsed.success) {
            console.error("Zod Validierungsfehler bei getAllPrompts:", JSON.stringify(parsed.error.issues, null, 2));
            throw new Error("Datenbank-Einträge entsprechen nicht dem Prompt-Schema");
        }
        return parsed.data;
    }

    static async getPromptById(Id: number): Promise< undefined | IPrompt> {
        const [rows] = await DB.query<RowDataPacket[]>(
            'select p.prompt_id, p.category_id, c.name, p.username, p.title, p.description, p.time_stamp from prompts p join category c on c.category_id = p.category_id WHERE p.prompt_id = ?',
                    [Id]);
        if (!rows || rows.length === 0) {
            return undefined;
        }
        const parsed = Prompt.safeParse(rows[0]);

        if (!parsed.success) {
            console.error("Zod Validierungsfehler bei getPromptById:", JSON.stringify(parsed.error.issues, null, 2));
            throw new Error(`Prompt mit ID ${Id} konnte nicht validiert werden.`);
        }
        return parsed.data;
    }

    static async createPrompt(data: INewPrompt, username: string): Promise<boolean> {
        const categoryExists = await CategoryService.checkCategoryId(data.category_id);
        if (!categoryExists) {
            return false;
        }

        const [insert] = await DB.execute<ResultSetHeader>(
            'INSERT INTO prompts (category_id, username, title, description) VALUES (?, ?, ?, ?)',
            [data.category_id, username, data.title, data.description]
        );

        return insert.affectedRows > 0;
    }
}