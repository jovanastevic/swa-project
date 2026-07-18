import jwt from 'jsonwebtoken';
import {Request, Response, NextFunction } from 'express';
import {ITokenPayload} from "../interface/User";


// just checking if the access token is valid or not.
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