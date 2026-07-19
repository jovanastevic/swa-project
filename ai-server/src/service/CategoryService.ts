import {DB} from "../middleware/db";
import {z} from "zod";
import {Category, ICategory} from "../interface/Category";
import {ResultSetHeader, RowDataPacket} from "mysql2";

export class CategoryService {
    static async getAllCategories(): Promise<'error' | ICategory[] | undefined> {
        try {
            const [categories] = await DB.query<RowDataPacket[]>('select id, name, description from category');
            if (!categories || categories.length === 0) {
                return undefined;
            }
            return z.array(Category).safeParse(categories).data;
        } catch (e) {
            console.error(e);
            return 'error';
        }
    }

    static async checkCategoryId(category_id: number): Promise<boolean> {
        const [rows] = await DB.query<RowDataPacket[]>(
            'select category_id from category where category_id= ?',
                [category_id]);
        return rows.length > 0;
    }
}