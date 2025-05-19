import mongoose, { model } from 'mongoose';

const serviceSchema = new mongoose.Schema({
    CreateDate: {
        type: Date,
        default: Date.now
    },
    Name: {
        type: String,
        require: true
    },
    Price: {
        type: Number,
        require: true,
    },
    Services: {
        type: [String],
        require: true
    },
    Description: {
        type: String,
        requiere: true
    },
    Admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'admin'
    }
});

export default model('service', serviceSchema);