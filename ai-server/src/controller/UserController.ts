import {Express, Request, Response} from "express";
import {User} from "../interface/User";
import {UserService} from "../service/UserService";


// TODO: Kommentare schreiben && Checken, ob das Error Handling so passt
// Eventuell den UserController ganz streichen und eine register Route in den AuthController schreiben. Somit muss
// auch das UML angepasst werden.
export class UserController {
    static init(app: Express) {
        app.post('/user/', UserController.createUser);
    }

    static async createUser(req: Request, res: Response) {
        const data = User.safeParse(req.body);

        if (!data.success) {
            res.status(400).json({
                message: 'Wrong input data',
                errors: data.error
            });
            return;
        }

        const result = await UserService.createUser(data.data);

        if (result === 'conflict') {
            res.status(409).send();
            return;
        } else if (result === 'error') {
            res.status(500).json({message: 'Database error'});
            return;
        }

        res.status(201).send();
    }

}