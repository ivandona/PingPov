var mongoose = require('mongoose');
var Schema = mongoose.Schema;


module.exports = mongoose.model('Match', new Schema({
        squadra1: [String],
        squadra2: [String],
        organizzatore: String,
        data: Date,
        sede: { type: String, enum: ['Povo1', 'Povo0'] },
        risultato: {
            score_sq1: { type: Number, default: -1 },
            score_sq2: { type: Number, default: -1 }
        },
        modalità: { type: String, enum: ['Singolo', 'Doppio'] },
    }));
