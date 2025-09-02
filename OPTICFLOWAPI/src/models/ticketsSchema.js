import mongoose, { model } from "mongoose";

const ticketSchema = new mongoose.Schema({
    CreateDate: {
        type: Date,
        default: Date.now
    },
    Issue: {
        type: String,
        require: true
    },
    Description: {
        type: String,
        require: true
    },
    Client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'client',
        require: true
    },
    Admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'admin',
        require: true
    },
    Folio: {
        type: String,
        require: true
    },
    Status: {
        require: true,
        default: 'Abierto',
        type: String
    },
    Priority: {
        require: true,
        type: String
    },

    tecnico: { 
        type:  String, 
        
        required: true },
});

ticketSchema.methods.setFolio = function setFolio(id,clientName,date) {
    const idString = id.toString();
    const identifier = idString.slice(0,2)+idString.slice(-2);

    const year = String(date.getFullYear()).slice(-2);
    const month = String(date.getMonth()+1).padStart(2,'0');
    const day = String(date.getDate()).padStart(2,'0');
    const formDate = year+month+day

    const clientChars = clientName.split(' ').map(palabra => palabra.charAt(0).toUpperCase()).join('');

    const folio = 'T'+identifier+'-'+formDate+clientChars;
    this.Folio = folio;
}

export default model('ticket', ticketSchema);