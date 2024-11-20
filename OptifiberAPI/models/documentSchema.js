import mongoose, {model} from "mongoose";

const documentSchema = new mongoose.Schema ({
    CreateDate: {
        type: Date,
        default: Date.now
    },
    Document: {
        type: String,
        require: true
    },
    Description:{
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

documentSchema.methods.setImgUrl = function setImgUrl(filename) {
    const host = process.env.HOST;
    const port = process.env.PORT;
    const route = '/api/public/';

    this.Document = `${host}:${port}${route}${filename}`;
}

export default model('document',documentSchema);