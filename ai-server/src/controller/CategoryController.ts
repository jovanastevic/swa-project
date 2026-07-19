import {CategoryService} from "../service/CategoryService";
import {Express, Request, Response} from "express";


export class CategoryController {
    static init(app: Express): void {
        app.get('/category', CategoryController.getAllCategories);
    }

    static async getAllCategories(req: Request, res: Response) {
        try{
            // It is possible to get an empty array
            const categories = await CategoryService.getAllCategories();

            res.status(200).json(categories);
        }catch (error) {
            console.error("Error fetching Category:", error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}