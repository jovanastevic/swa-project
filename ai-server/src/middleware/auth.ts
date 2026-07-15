import jwt from 'jsonwebtoken';
import {Request, Response, NextFunction } from 'express';

interface ITokenPayload {
    username : string;
}

export function generateTokenAccessToken(payload: ITokenPayload):string {
    return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '15min'});
}

export function generateTokenRefreshToken(payload: ITokenPayload):string {
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET!, { expiresIn: '7d'});
}

export function validateAuth(req: Request, res: Response, next: NextFunction) {
    try{
        const token = req.cookies.accessToken;

        if (!token) {
            return res.status(401).json({ message: "Authentication required" });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as ITokenPayload;

        req.params._username = decoded.username;
        next();
    } catch {
        res.status(401).json({message: "Invalid or expired token"});
    }
}