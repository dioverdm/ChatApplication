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
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const zod_1 = require("zod");
const headerSchema = zod_1.z.object({
    authorization: zod_1.z.string()
});
const authMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // console.log(req.headers.authorization);
        const { authorization } = headerSchema.parse(req.headers);
        // console.log(authorization);
        if (!authorization.startsWith('Bearer'))
            return res.send('Send token in proper format!!');
        const token = authorization.split(' ')[1];
        //decodes token id
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        // console.log(decoded);
        req._id = decoded.id;
        // console.log(typeof (req._id));
        next();
    }
    catch (error) {
        return res.status(401).send("Not authorized, token failed");
        // return("Not authorized, token failed");
    }
});
exports.authMiddleware = authMiddleware;
