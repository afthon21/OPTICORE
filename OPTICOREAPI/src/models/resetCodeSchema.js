import mongoose, { model } from "mongoose";

const resetCodeSchema = new mongoose.Schema({
    CreateDate: {
        type: Date,
        default: Date.now
    },
    User: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'admin'
    },
    Email: {
        type: String,
        require: true
    },
    Code:{
        type: String,
        require: true
    },
    ExpireAt: {
        type: Date,
        require: true
    }
});

export default model('resetCode', resetCodeSchema);