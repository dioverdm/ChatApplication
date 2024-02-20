"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const dbConnect_1 = require("./utils/dbConnect");
const index_1 = __importDefault(require("./routes/index"));
const cloudinary_1 = require("cloudinary");
const http_1 = require("http"); // Import createServer function from http
const socket_io_1 = require("socket.io"); // Import Server from socket.io
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
const app = (0, express_1.default)();
const origin = 'http://localhost:5173';
//Middlewares
app.use(express_1.default.json({ limit: '10mb' }));
app.use((0, cors_1.default)({
    credentials: true,
    origin: origin
}));
app.use('/api', index_1.default);
app.get('/health', (req, res) => {
    res.send("server is running properly");
});
(0, dbConnect_1.dbConnect)();
const PORT = process.env.PORT || 5001;
const httpServer = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(httpServer, {
    pingTimeout: 60000,
    cors: {
        origin: 'http://localhost:5173',
    }
});
io.on('connection', (socket) => {
    // console.log('a user connected');
    socket.on('setup', (userData) => {
        socket.join(JSON.stringify(userData._id));
        socket.emit('connected');
    });
    socket.on('join chat', (room) => {
        socket.join(JSON.stringify(room));
        // console.log('user joined room '+room);
    });
    socket.on("typing", (room) => {
        socket.to(JSON.stringify(room)).emit("typing");
    });
    socket.on("stop typing", (room) => socket.to(JSON.stringify(room)).emit("stop typing"));
    socket.on('new message', (newMessageReceived) => {
        // console.log(newMessageReceived);
        const chat = newMessageReceived.chat;
        if (!chat.users)
            return;
        chat.users.forEach((user) => {
            if (user._id === newMessageReceived.sender._id)
                return;
            // console.log(user);
            socket.to(JSON.stringify(user._id)).emit('message received', newMessageReceived);
        });
    });
    socket.on('disconnect', () => {
        // console.log('user disconnected');
    });
});
const dirname = function () {
    return __dirname;
};
const webappBuildPath = './../../client/dist';
app.use('/assets', express_1.default.static(path_1.default.join(dirname(), webappBuildPath), { immutable: true, maxAge: '1y' }));
app.use(express_1.default.static(path_1.default.join(dirname(), webappBuildPath), { setHeaders: () => ({ 'Cache-Control': 'no-cache, private' }) }));
app.get('*', (_, res) => {
    res.sendFile(path_1.default.join(dirname(), webappBuildPath, 'index.html'), { headers: { 'Cache-Control': 'no-cache, private' } });
});
httpServer.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
});
