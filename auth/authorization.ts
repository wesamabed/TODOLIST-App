import * as jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import {User, IUser } from '../models/User'; 

interface CustomRequest extends Request {
    user?: IUser | null;
}

const verifyToken = async (req: CustomRequest, res: Response, next: NextFunction) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        return res.status(403).send('A token is required for authorization');
    }
    try {
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key');
        const user: IUser | null = await User.findById(decoded.userId);
        req.user = user; 
        return next();
    } catch (err:any) {
        return res.status(401).send('Invalid Token');
    }
};

export default verifyToken;
