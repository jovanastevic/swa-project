import {Express, Request, Response} from "express";
import {validateAuth} from "../middleware/auth";
import {ChatroomService} from "../service/ChatroomService";

export class ChatroomController {
    static init(app: Express): void {
        app.get('/chatoverview', validateAuth, ChatroomController.getUserChatrooms);
        app.get('/chat/:id', validateAuth, ChatroomController.getMessagesByChatId);
        app.post('/chat/join/:prompt_id', validateAuth, ChatroomController.JoinOrCreateChatroom)

    }

    static async getUserChatrooms(req: Request, res: Response){
        try{
            const username = req.params._username as string;
            const result = await ChatroomService.getUserChatrooms(username);


            return res.status(200).json(result);
        } catch (error){
            console.error("Error fetching User Chat overview:", error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    static async getMessagesByChatId(req: Request, res: Response){
        try{
            const id = parseInt(req.params.id as string);

            if (isNaN(id)) {
                res.status(400).json({ message: "Invalid chat id" });
                return;
            }

            const result = await ChatroomService.getMessagesByChatId(id);

            res.status(200).json(result);
        } catch (error){
            console.error("Error fetching User Chat messages:", error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    static async JoinOrCreateChatroom(req: Request, res: Response){
        try{
            const username = req.params._username as string;
            const prompt_id = parseInt(req.params.prompt_id as string);

            if (isNaN(prompt_id)) {
                res.status(400).json({ message: "Invalid prompt id" });
                return;
            }

            const room = await ChatroomService.JoinOrCreateChatroom(username, prompt_id);

            res.status(201).json(room);
        }catch (error: any) {
            console.error("Error joining or creating Chatroom:", error);
            if (error.message && error.message.includes("nicht gefunden")) {
                res.status(404).json({ message: 'Prompt was not found' });
                return;
            }
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}