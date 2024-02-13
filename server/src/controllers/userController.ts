import User from '../models/userModel';
import { Request, Response } from 'express';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import { generateToken } from '../utils/generateToken';
import { v2 as cloudinary } from 'cloudinary';
import { newRequest } from '../middlewares/authMiddleware';

export const signupData = z.object({
    name: z.string().max(50),
    email: z.string().max(100),
    password: z.string().max(50).min(8),
    pic: z.string().optional()
})

const loginData = signupData.pick({
    email: true,
    password: true
})

export const allUsers = async (req: newRequest, res: Response) => {
    try {
        const keyword = req.query.search
            ? {
                $or: [
                    { name: { $regex: req.query.search, $options: "i" } },
                    { email: { $regex: req.query.search, $options: "i" } },
                ],
            }
            : {};

        const users = await User.find(keyword).find({ _id: { $ne: req._id } });
        return res.send(users);
    } catch (error) {
        return res.send((error as Error).message);
    }
};

export const signpController = async (req: Request, res: Response) => {
    try {
        const { name, email, password, pic } = signupData.parse(req.body);
        // console.log(pic);
        const present = await User.findOne({ email: email });

        const hashPassword = await bcrypt.hash(password, 10);
        if (present) {
            res.send('User already exists!!');
        }
        if (pic) {
            const cloudImg = await cloudinary.uploader.upload(pic!, {
                folder: "chatApp/Avatar"
            })
        }
        const user = await User.create({
            name, email, password: hashPassword, pic
        });
        const accessToken = await generateToken(user._id.toString());
        // console.log(accessToken);
        // localStorage.setItem("accessToken", JSON.stringify(accessToken));
        // console.log(user);

        return res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            pic: user.pic,
            token: accessToken
        });
    } catch (error) {
        // console.log(error);
        return res.send((error as Error).message)
    }
}

export const loginController = async (req: Request, res: Response) => {
    try {
        const { email, password } = loginData.parse(req.body);
        const user = await User.findOne({ email });

        if (!user) return res.send("User does not exists!!");
        if (!bcrypt.compare(password, user.password)) {
            return res.send("Wrong Password!!");
        }
        const token = generateToken(user._id.toString());
        return res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            pic: user.pic,
            token: token
        });
    } catch (error) {
        // console.log(error);
        return res.send((error as Error).message);
    }
}
