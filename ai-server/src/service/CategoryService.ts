import {DB} from "../middleware/db";
import {z} from "zod";
import {Category, ICategory} from "../interface/Category";
import { RowDataPacket} from "mysql2";

export class CategoryService {
    static async getAllCategories(): Promise<ICategory[]> {
        const [categories] = await DB.query<RowDataPacket[]>(
            'select category_id, title, description from category');

        if(!categories || categories.length === 0) {
            return [];
        }
        const parsed = z.array(Category).safeParse(categories);

        if (!parsed.success) {
            console.error("Zod Validierungsfehler bei getAllCategories:",
                JSON.stringify(parsed.error.issues, null, 2)); // format the error nicely
            throw new Error(`Category-Daten konnten nicht validiert werden.`);
        }
        return parsed.data;
    }

    static async checkCategoryId(category_id: number): Promise<boolean> {
        const [rows] = await DB.query<RowDataPacket[]>(
            'select category_id from category where category_id= ?',
                    [category_id]);
        return rows.length > 0;
    }
}