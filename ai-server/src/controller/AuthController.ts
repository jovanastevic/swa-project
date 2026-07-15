import {Express, Request, Response} from 'express';
import {UserLogin, User} from '../interface/User';
import {UserService} from '../service/UserService';
import {generateTokenAccessToken, generateTokenRefreshToken} from '../middleware/auth';

// TODO: Kommentare Schreiben & auth middleware checken sowie die Logout route implementieren
export class AuthController {
    static init(app: Express): void {
        app.post('/login', AuthController.login);
        app.post('/register', AuthController.register);
    }

    static async login(req: Request, res: Response): Promise<void> {
        const data = UserLogin.safeParse(req.body);

        if (!data.success) {
            res.status(400).json({message: 'Missing fields'});
            return;
        }

        const result = await UserService.validatePassword(data.data);

        if (!result) {
            res.status(401).send();
            return
        }
        const AcTpayload = {username: data.data.username, role: 'user'};
        const AccessToken = generateTokenAccessToken(AcTpayload);

        const ReTpayload = {username: data.data.username};
        const RefreshToken = generateTokenRefreshToken(ReTpayload);

        res.cookie('accessToken', AcTpayload, {
            httpOnly: true,
            secure: false,
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000 // 15 Minuten
        });

        res.cookie('refreshToken', RefreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            path: '/api/refresh', // Only sent to refresh endpoint || ist noch von einer Toturial Webseite muss ich mir noch anschauen was das ist
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.json({
            message: 'Login erfolgreich',
            username: data.data.username
        });
    }

    static async register(req: Request, res: Response) {
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