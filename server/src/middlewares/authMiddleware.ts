import jwt, { JwtPayload, decode } from "jsonwebtoken";
import User from "../models/userModel.js";
import { Request, NextFunction, Response, request } from "express";
import { z } from 'zod';

import { signupData } from "../controllers/userController.js";
import mongoose from "mongoose";

const headerSchema = z.object({
    authorization: z.string()
})

export interface newRequest extends Request {
    _id?: string;
}
export const authMiddleware = async (req: newRequest, res: Response, next: NextFunction) => {
    try {
        // console.log(req.headers.authorization);
        const { authorization } = headerSchema.parse(req.headers);
        // console.log(authorization);
        if (!authorization.startsWith('Bearer')) return res.send('Send token in proper format!!');
        const token = authorization.split(' ')[1];

        //decodes token id
        const decoded = jwt.verify(token, process.env.JWT_SECRET!);
        // console.log(decoded);
        req._id = (decoded as JwtPayload).id;
        // console.log(typeof (req._id));
        next();
    } catch (error) {
        return res.status(401).send("Not authorized, token failed");
        // return("Not authorized, token failed");
    }
}

