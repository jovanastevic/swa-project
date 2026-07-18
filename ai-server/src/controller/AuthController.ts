import {Express, Request, Response} from 'express';
import {UserLogin, User, ITokenPayload} from '../interface/User';
import {UserService} from '../service/UserService';
import jwt from 'jsonwebtoken';

export class AuthController {
    static init(app: Express): void {
        app.post('/login', AuthController.login);
        app.post('/register', AuthController.register);
        app.post('/logout', AuthController.logout);
        app.post('/refresh', AuthController.refresh);
    }

    static async login(req: Request, res: Response): Promise<void> {
        const data = UserLogin.safeParse(req.body); // parse the request body in (username, password) format

        if (!data.success) {
            res.status(400).json({message: 'Missing fields'}); // worng input data
            return;
        }

        const result = await UserService.validatePassword(data.data); // Validate password

        if (!result) {
            res.status(401).send();
            return
        }

        // genarte access token and refresh token
        const AccessToken = jwt.sign(
            {username: data.data.username, role: 'user'},
            process.env.JWT_SECRET!,
            {expiresIn: '15m'});

        const RefreshToken = jwt.sign(
            {username: data.data.username},
            process.env.JWT_SECRET!,
            {expiresIn: '7d'});

        // setting the access token and refresh token in cookies
        res.cookie('accessToken', AccessToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000 // 15 Minuten
        });

        res.cookie('refreshToken', RefreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            path: '/refresh', // this cookie will only be sent to the /refresh endpoint
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.json({
            message: 'Login erfolgreich',
            username: data.data.username
        });
    }

    static async register(req: Request, res: Response) {
        const data = User.safeParse(req.body); // parse the request body in (username, password, email) format

        if (!data.success) {
            res.status(400).json({
                message: 'Wrong input data',
                errors: data.error
            });
            return;
        }

        // create user in database
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

    static async refresh(req: Request, res: Response) {
        const refreshToken = req.cookies.refreshToken; // get the refresh token from cookies

        if (!refreshToken) {
            return res.status(401).json({ message: 'Refresh token required' });
        }
        try{ // trying to verify the refresh token and generate a new access token
            const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!) as ITokenPayload

            const newAccessToken = jwt.sign(
                {username: decoded.username, role: 'user'},
                process.env.JWT_SECRET!,
                {expiresIn: '15m'});

            res.cookie('accessToken', newAccessToken, {
                httpOnly: true,
                secure: false,
                sameSite: 'strict',
                maxAge: 15 * 60 * 1000 // 15 Minuten
            });

            res.json({ message: 'Token refreshed successfully' });
        }
        catch (err: any) {
            res.status(401).json({message: "Invalid or expired token"});
        }
    }

    static async logout(req: Request, res: Response) {
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken', {path: '/refresh'}); // Clear the refresh token cookie

        res.json({ message: 'Logged out successfully' });
    }
}