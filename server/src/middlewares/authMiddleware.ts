import jwt, { JwtPayload } from "jsonwebtoken";
import User from "../models/userModel.js";
import { Request, NextFunction, Response, request } from "express";
import { z } from 'zod';

import { signupData } from "../controllers/userController.js";

const headerSchema = z.object({
    authorization: z.string()
})

interface newRequest extends Request {
    user: z.infer<typeof signupData>
}
export const protect = async (req: newRequest, res: Response, next: NextFunction) => {
    try {
        const { authorization } = headerSchema.parse(req.headers.authorization);
        if (!authorization.startsWith('Bearer')) return res.send('Send token in proper format!!');
        const token = authorization.split(' ')[1];

        //decodes token id
        const decoded = jwt.verify(token, process.env.JWT_SECRET!);

        req.user = await User.findById((decoded as JwtPayload).id).select("-password");

        next();
    } catch (error) {
        res.status(401);
        throw new Error("Not authorized, token failed");
    }
}

