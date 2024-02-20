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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginController = exports.signpController = exports.allUsers = exports.signupData = void 0;
var userModel_1 = require("../models/userModel");
var zod_1 = require("zod");
var bcrypt_1 = require("bcrypt");
var generateToken_1 = require("../utils/generateToken");
var cloudinary_1 = require("cloudinary");
exports.signupData = zod_1.z.object({
    name: zod_1.z.string().max(50),
    email: zod_1.z.string().max(100),
    password: zod_1.z.string().max(50).min(8),
    pic: zod_1.z.string().optional()
});
var loginData = exports.signupData.pick({
    email: true,
    password: true
});
var allUsers = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var keyword, users, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                keyword = req.query.search
                    ? {
                        $or: [
                            { name: { $regex: req.query.search, $options: "i" } },
                            { email: { $regex: req.query.search, $options: "i" } },
                        ],
                    }
                    : {};
                return [4 /*yield*/, userModel_1.default.find(keyword).find({ _id: { $ne: req._id } })];
            case 1:
                users = _a.sent();
                return [2 /*return*/, res.send(users)];
            case 2:
                error_1 = _a.sent();
                return [2 /*return*/, res.send(error_1.message)];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.allUsers = allUsers;
var signpController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, name_1, email, password, pic, present, hashPassword, cloudImg, user, accessToken, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 7, , 8]);
                _a = exports.signupData.parse(req.body), name_1 = _a.name, email = _a.email, password = _a.password, pic = _a.pic;
                return [4 /*yield*/, userModel_1.default.findOne({ email: email })];
            case 1:
                present = _b.sent();
                return [4 /*yield*/, bcrypt_1.default.hash(password, 10)];
            case 2:
                hashPassword = _b.sent();
                if (present) {
                    res.send('User already exists!!');
                }
                if (!pic) return [3 /*break*/, 4];
                return [4 /*yield*/, cloudinary_1.v2.uploader.upload(pic, {
                        folder: "chatApp/Avatar"
                    })];
            case 3:
                cloudImg = _b.sent();
                _b.label = 4;
            case 4: return [4 /*yield*/, userModel_1.default.create({
                    name: name_1,
                    email: email,
                    password: hashPassword,
                    pic: pic
                })];
            case 5:
                user = _b.sent();
                return [4 /*yield*/, (0, generateToken_1.generateToken)(user._id.toString())];
            case 6:
                accessToken = _b.sent();
                // console.log(accessToken);
                // localStorage.setItem("accessToken", JSON.stringify(accessToken));
                // console.log(user);
                return [2 /*return*/, res.json({
                        _id: user._id,
                        name: user.name,
                        email: user.email,
                        isAdmin: user.isAdmin,
                        pic: user.pic,
                        token: accessToken
                    })];
            case 7:
                error_2 = _b.sent();
                // console.log(error);
                return [2 /*return*/, res.send(error_2.message)];
            case 8: return [2 /*return*/];
        }
    });
}); };
exports.signpController = signpController;
var loginController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, password, user, token, error_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = loginData.parse(req.body), email = _a.email, password = _a.password;
                return [4 /*yield*/, userModel_1.default.findOne({ email: email })];
            case 1:
                user = _b.sent();
                if (!user)
                    return [2 /*return*/, res.send("User does not exists!!")];
                if (!bcrypt_1.default.compare(password, user.password)) {
                    return [2 /*return*/, res.send("Wrong Password!!")];
                }
                token = (0, generateToken_1.generateToken)(user._id.toString());
                return [2 /*return*/, res.status(201).json({
                        _id: user._id,
                        name: user.name,
                        email: user.email,
                        isAdmin: user.isAdmin,
                        pic: user.pic,
                        token: token
                    })];
            case 2:
                error_3 = _b.sent();
                // console.log(error);
                return [2 /*return*/, res.send(error_3.message)];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.loginController = loginController;
