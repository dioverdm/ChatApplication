import mongoose from 'mongoose';

export const dbConnect = async () => {
    try {
        await mongoose.connect(process.env.mongo_url!);
        console.log("connected to db!!");
    } catch (error) {
        console.log(error);
    }
}