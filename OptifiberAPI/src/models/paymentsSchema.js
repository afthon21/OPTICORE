import mongoose, { model } from "mongoose";

const paymentSchema = new mongoose.Schema({
    CreateDate:{
        type: Date,
        default: Date.now
    },
    Client:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'client'
    },
    Method:{
        type: String,
        require: true
    },
    Amount:{
        type: Number,
        require: true
    },
    Note:{
        type: String,
        require: false
    },
    Admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'admin'
    },
    Folio:{
        type: String,
        require: true
    }
});

paymentSchema.methods.setFolio = function setFolio(id,clientName,adminName,date) {
    const idString = id.toString();
    const identifier = idString.slice(0,2)+idString.slice(-2);

    const year = String(date.getFullYear()).slice(-2);
    const month = String(date.getMonth()+1).padStart(2,'0');
    const day = String(date.getDate()).padStart(2,'0');
    const formDate = year+month+day

    const clientChars = clientName.split(' ').map(palabra => palabra.charAt(0).toUpperCase()).join('');

    const folio = 'PY'+identifier+'-'+formDate+clientChars;
    this.Folio = folio;
}

export default model('payment',paymentSchema);