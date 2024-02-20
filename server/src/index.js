"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var dotenv_1 = require("dotenv");
var cors_1 = require("cors");
var dbConnect_1 = require("./utils/dbConnect");
var index_1 = require("./routes/index");
var cloudinary_1 = require("cloudinary");
var http_1 = require("http"); // Import createServer function from http
var socket_io_1 = require("socket.io"); // Import Server from socket.io
var path_1 = require("path");
dotenv_1.default.config();
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
var app = (0, express_1.default)();
var origin = 'http://localhost:5173';
//Middlewares
app.use(express_1.default.json({ limit: '10mb' }));
app.use((0, cors_1.default)({
    credentials: true,
    origin: origin
}));
app.use('/api', index_1.default);
app.get('/health', function (req, res) {
    res.send("server is running properly");
});
(0, dbConnect_1.dbConnect)();
var PORT = process.env.PORT || 5001;
var httpServer = (0, http_1.createServer)(app);
var io = new socket_io_1.Server(httpServer, {
    pingTimeout: 60000,
    cors: {
        origin: 'http://localhost:5173',
    }
});
io.on('connection', function (socket) {
    // console.log('a user connected');
    socket.on('setup', function (userData) {
        socket.join(JSON.stringify(userData._id));
        socket.emit('connected');
    });
    socket.on('join chat', function (room) {
        socket.join(JSON.stringify(room));
        // console.log('user joined room '+room);
    });
    socket.on("typing", function (room) {
        socket.to(JSON.stringify(room)).emit("typing");
    });
    socket.on("stop typing", function (room) { return socket.to(JSON.stringify(room)).emit("stop typing"); });
    socket.on('new message', function (newMessageReceived) {
        // console.log(newMessageReceived);
        var chat = newMessageReceived.chat;
        if (!chat.users)
            return;
        chat.users.forEach(function (user) {
            if (user._id === newMessageReceived.sender._id)
                return;
            // console.log(user);
            socket.to(JSON.stringify(user._id)).emit('message received', newMessageReceived);
        });
    });
    socket.on('disconnect', function () {
        // console.log('user disconnected');
    });
});
var dirname = function () {
    return __dirname;
};
var webappBuildPath = './../../client/dist';
app.use('/assets', express_1.default.static(path_1.default.join(dirname(), webappBuildPath), { immutable: true, maxAge: '1y' }));
app.use(express_1.default.static(path_1.default.join(dirname(), webappBuildPath), { setHeaders: function () { return ({ 'Cache-Control': 'no-cache, private' }); } }));
app.get('*', function (_, res) {
    res.sendFile(path_1.default.join(dirname(), webappBuildPath, 'index.html'), { headers: { 'Cache-Control': 'no-cache, private' } });
});
httpServer.listen(PORT, function () {
    console.log("server running on port ".concat(PORT));
});
