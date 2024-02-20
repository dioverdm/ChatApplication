"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginController = exports.signpController = exports.allUsers = exports.signupData = void 0;
const userModel_1 = __importDefault(require("../models/userModel"));
const zod_1 = require("zod");
const bcrypt_1 = __importDefault(require("bcrypt"));
const generateToken_1 = require("../utils/generateToken");
const cloudinary_1 = require("cloudinary");
exports.signupData = zod_1.z.object({
    name: zod_1.z.string().max(50),
    email: zod_1.z.string().max(100),
    password: zod_1.z.string().max(50).min(8),
    pic: zod_1.z.string().optional()
});
const loginData = exports.signupData.pick({
    email: true,
    password: true
});
const allUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const keyword = req.query.search
            ? {
                $or: [
                    { name: { $regex: req.query.search, $options: "i" } },
                    { email: { $regex: req.query.search, $options: "i" } },
                ],
            }
            : {};
        const users = yield userModel_1.default.find(keyword).find({ _id: { $ne: req._id } });
        return res.send(users);
    }
    catch (error) {
        return res.send(error.message);
    }
});
exports.allUsers = allUsers;
const signpController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password, pic } = exports.signupData.parse(req.body);
        // console.log(pic);
        const present = yield userModel_1.default.findOne({ email: email });
        const hashPassword = yield bcrypt_1.default.hash(password, 10);
        if (present) {
            res.send('User already exists!!');
        }
        if (pic) {
            const cloudImg = yield cloudinary_1.v2.uploader.upload(pic, {
                folder: "chatApp/Avatar"
            });
        }
        const user = yield userModel_1.default.create({
            name, email, password: hashPassword, pic
        });
        const accessToken = yield (0, generateToken_1.generateToken)(user._id.toString());
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
    }
    catch (error) {
        // console.log(error);
        return res.send(error.message);
    }
});
exports.signpController = signpController;
const loginController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = loginData.parse(req.body);
        const user = yield userModel_1.default.findOne({ email });
        if (!user)
            return res.send("User does not exists!!");
        if (!bcrypt_1.default.compare(password, user.password)) {
            return res.send("Wrong Password!!");
        }
        const token = (0, generateToken_1.generateToken)(user._id.toString());
        return res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            pic: user.pic,
            token: token
        });
    }
    catch (error) {
        // console.log(error);
        return res.send(error.message);
    }
});
exports.loginController = loginController;
