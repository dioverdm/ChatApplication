import User from '../models/userModel';
import { Request, Response } from 'express';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import { generateToken } from '../utils/generateToken';

const signupData = z.object({
    name: z.string().max(50),
    email: z.string().max(100),
    password: z.string().max(50).min(8),
    pic: z.instanceof(File).optional()
})

const loginData=signupData.pick({
    email:true,
    password:true
})

export const signpController = async (req: Request, res: Response) => {
    try {
        const { name, email, password, pic } = signupData.parse(req.body);

        const present = await User.findOne({ email: email });

        const hashPassword = await bcrypt.hash(password, 10);
        if (present) {
            res.send('User already exists!!');
        }
        const user = await User.create({
            name, email, password: hashPassword, pic
        });
        const accessToken = await generateToken(user._id.toString());
        console.log(user);

        return res.send(accessToken);
    } catch (error) {
        return res.send((error as Error).message)
    }
}

export const loginController=async (req:Request,res:Response)=>{
    try {
        const {email,password}=loginData.parse(req.body);
        const user=await User.findOne({email});

        if(!user) return res.send("User does not exists!!");
        Object.assign(user,{token:generateToken(user._id.toString())});
        return res.json(user);
    } catch (error) {
        return res.send((error as Error).message);
    }
}
