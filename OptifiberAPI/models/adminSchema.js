import mongoose, { model } from "mongoose";

const adminSchema = new mongoose.Schema({
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
    UserName:{
        type: String,
        require: true
    },
    Email: {
        type: String,
        require: true,
        unique: true
    },
    Password: {
        type: String,
        require: true,
        minlenght: 8
    },
    Date: {
        type: Date,
        default: Date.now,
    }
});

//Función para crear el nombre de usuario
adminSchema.methods.setUser = function setUser(FirstName,FatherLastName,MotherLastName) {
    const name = FirstName;
    const characterOne = FatherLastName;
    const characterTwo = MotherLastName;

    const userName = name+'_'+characterOne.charAt(0)+characterTwo.charAt(0);
    this.UserName = userName;
}

export default model('admin',adminSchema);