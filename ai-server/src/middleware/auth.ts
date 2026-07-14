import jwt from 'jsonwebtoken';
import {Request, Response, NextFunction } from 'express';

interface ITokenPayload {
    username : string;
}

export function generateToken(payload: ITokenPayload):string {
    return jwt.sign(payload, process.env.JWT_SECRET!);
}

export function validateAuth(req: Request, res: Response, next: NextFunction) {
    try{
        const token = req.cookies.auth_token;

        if (!token) {
            res.status(401).json({ message: "Kein Cookie gefunden" });
            return;
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as ITokenPayload;

        req.params._username = decoded.username;
        next();
    } catch {
        res.status(401).send();
    }
}