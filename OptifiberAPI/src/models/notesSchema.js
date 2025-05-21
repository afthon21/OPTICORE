import mongoose, { model } from "mongoose";

const notesSchema = new mongoose.Schema({
    CreateDate: {
        type: Date,
        default: Date.now,
    },
    Description: {
        type: String,
        require: true
    },
    Client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'client'
    },
    Admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'admin'
    }
});

export default model('notes', notesSchema);