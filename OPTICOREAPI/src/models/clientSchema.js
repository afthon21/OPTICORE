import mongoose, { model } from "mongoose";

const clientSchema = new mongoose.Schema({
    CreateDate: {
        type: Date,
        default: Date.now
    },
    Name: {
        FirstName: {
            type: String,
            require: true
        },
        SecondName: {
            type: String,
            require: false
        }
    },
    LastName: {
        FatherLastName: {
            type: String,
            require: true
        },
        MotherLastName: {
            type: String,
            require: true
        }
    },
    PhoneNumber: {
        type: [Number],
        require: true
    },
    Email: {
        type: String,
        require: true
    },
    Location: {
        State: {
            type: String,
            require: true
        },
        Municipality: {
            type: String,
            require: true
        },
        ZIP: {
            type: String,
            require: true
        },
        Address: {
            type: String,
            require: true
        },
        Cologne: {
            type: String,
            require: true
        },
        Locality: {
            type: String,
            require: true
        },
        OutNumber: {
            type: [Number, String],
            require: true
        },
        InNumber: {
            type: [String, Number]
        },
        Latitude: {
            type: Number,
            require: false
        },
        Length: {
            type: Number,
            require: false
        }
    },
    Status: {
        type: String
    }
});

export default model('client', clientSchema);