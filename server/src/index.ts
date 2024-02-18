import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { dbConnect } from './utils/dbConnect';
import mainRouter from './routes/index';
import { v2 as cloudinary } from 'cloudinary';
import { createServer } from 'http'; // Import createServer function from http
import { Server as SocketIO } from 'socket.io'; // Import Server from socket.io
import mongoose from 'mongoose';

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const app = express();
const origin = 'http://localhost:5173';

//Middlewares

app.use(express.json({ limit: '10mb' }));

app.use(cors({
    credentials: true,
    origin: origin
}))

app.use('/api', mainRouter);
app.get('/chat', (req, res) => {
    res.send("server is running properly");
})

dbConnect();

const PORT = process.env.PORT || 5001;
const httpServer = createServer(app);
const io = new SocketIO(httpServer, {
    pingTimeout: 60000,
    cors: {
        origin: 'http://localhost:5173',
    }
});

interface userSchema {
    _id: mongoose.Schema.Types.ObjectId;
    name: string;
    email: string;
    pic?: string;
    isAdmin: boolean;
}
io.on('connection', (socket) => {
    // console.log('a user connected');

    socket.on('setup', (userData) => {
        socket.join(JSON.stringify(userData._id));
        socket.emit('connected');
    })

    socket.on('join chat', (room) => {
        socket.join(JSON.stringify(room));
        // console.log('user joined room '+room);
    })

    socket.on('new message', (newMessageReceived) => {
        // console.log(newMessageReceived);
        const chat = newMessageReceived.chat;

        if (!chat.users) return;

        chat.users.forEach((user: userSchema) => {
            if (user._id === newMessageReceived.sender._id) return;
            // console.log(user);

            socket.to(JSON.stringify(user._id)).emit('message received', newMessageReceived);
        });
    })
    socket.on('disconnect', () => {
        // console.log('user disconnected');
    });
});

httpServer.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
});
