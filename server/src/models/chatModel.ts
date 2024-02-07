import mongoose from 'mongoose';


const chatModel = new mongoose.Schema({
    chatName: {
        type: String,
        trim: true
    },
    isGroup: {
        type: Boolean,
        default: false
    },
    users: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        }
    ],
    latestMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'message'
    },
    groupAdmin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }
}, { timestamps: true });

export default mongoose.model('chat', chatModel); 