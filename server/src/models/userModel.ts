import mongoose from "mongoose";

const userModel = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    pic: {
        type: String,
        default: "http://d01.flexynode.com:26659/general/default_profile.jpg"
    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false,
    }
}, { timestamps: true })

export default mongoose.model('user', userModel);
