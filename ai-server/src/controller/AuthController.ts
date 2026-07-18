import {Express, Request, Response} from 'express';
import {UserLogin, User, ITokenPayload} from '../interface/User';
import {UserService} from '../service/UserService';
import jwt from 'jsonwebtoken';
import z from 'zod';

export class AuthController {
    static init(app: Express): void {
        app.post('/login', AuthController.login);
        app.post('/register', AuthController.register);
        app.post('/logout', AuthController.logout);
        app.post('/refresh', AuthController.refresh);
    }

    static async login(req: Request, res: Response): Promise<void> {
        try{
            const data = UserLogin.safeParse(req.body); // parse the request body in (username, password) format

            if (!data.success) {
                res.status(400).json({
                    message: 'Missing or invalid fields',
                    errors: z.treeifyError(data.error)
                }); // worng input data
                return;
            }

            const isValid = await UserService.validatePassword(data.data); // Validate password

            if (!isValid) {
                res.status(401).json({message: 'Invalid Credentials'});
                return
            }

            // genarte access token and refresh token
            const AccessToken = jwt.sign(
                {username: data.data.username, role: 'user'},
                process.env.JWT_SECRET!,
                {expiresIn: '15m'});

            const RefreshToken = jwt.sign(
                {username: data.data.username},
                process.env.REFRESH_TOKEN_SECRET!,
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
        }catch (error){
            console.error("Login Error:", error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    static async register(req: Request, res: Response) {
        try{
            const data = User.safeParse(req.body); // parse the request body in (username, password, email) format

            if (!data.success) {
                res.status(400).json({
                    message: 'Wrong input data',
                    errors: z.treeifyError(data.error)
                });
                return;
            }

            // create user in database
            const isCreated = await UserService.createUser(data.data);

            if (!isCreated) {
                res.status(409).json({ message: 'Username already exists' });
                return;
            }

            res.status(201).json({ message: 'User created successfully' });
        }catch (error){
            console.error("Register Error:", error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    static async refresh(req: Request, res: Response) {
        try{
            const refreshToken = req.cookies.refreshToken; // get the refresh token from cookies

            if (!refreshToken) {
                res.status(401).json({message: 'Refresh token required'});
                return;
            }
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

                res.json({message: 'Token refreshed successfully'});
        } catch (error: any){
            if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
                res.status(401).json({ message: "Invalid or expired token" });
                return;
            }
            console.error("Refresh Error:", error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    static async logout(req: Request, res: Response) {
        try{
            res.clearCookie('accessToken');
            res.clearCookie('refreshToken', {path: '/refresh'}); // Clear the refresh token cookie

            res.json({message: 'Logged out successfully'});
        }catch (error){
            console.error("Logout Error:", error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}