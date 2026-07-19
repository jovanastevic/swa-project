import {PromptService} from "../service/PromptService";
import {Express, Request, Response} from "express";
import {NewPrompt} from "../interface/Prompt";
import {validateAuth} from "../middleware/auth";
import z from "zod";

export class PromptController {
    static init(app: Express): void {
        app.get('/prompts/', PromptController.getAllPrompts);
        app.get('/prompts/:id', PromptController.getPromptById);
        app.post('/prompts/',validateAuth, PromptController.createPrompt);
    }

    static async getAllPrompts(req: Request, res: Response) {
        try{
            const prompts = await PromptService.getAllPrompts();

            res.status(200).json(prompts);
        }catch (error) {
            console.error("Error fetching prompts:", error);
            res.status(500).json({message: 'Internal server error'});
        }
    }

    static async getPromptById(req: Request, res: Response) {
        try{
            const id = parseInt(req.params.id as string);

            if (isNaN(id)) {
                res.status(400).json({ message: "Invalid prompt id" });
                return;
            }

            const prompt = await PromptService.getPromptById(id);
            if (!prompt) {
                res.status(404).json({message: `Prompt with ID ${req.params.id} not found`});
                return;
            }

            res.status(200).json(prompt);
        } catch (error) {
            console.error("Error fetching prompt:", error);
            res.status(500).json({message: 'Internal server error'});
        }
    }

    static async createPrompt(req: Request, res: Response) {
        try{
            const username = req.params._username as string;
            const data = NewPrompt.safeParse(req.body);

            if (!data.success) {
                res.status(400).json({
                    message: 'Missing or invalid fields',
                    errors: z.treeifyError(data.error)
                }); // worng input data
                return;
            }

            const result = await PromptService.createPrompt(data.data, username);
            if (!result) {
                res.status(400).json({message: 'Failed to create prompt or Catagory does not exist'});
                return;
            }
            res.status(201).send();
        }catch (error) {
            console.error("Error creating prompt:", error);
            res.status(500).json({message: 'Internal server error'});
        }
    }
}