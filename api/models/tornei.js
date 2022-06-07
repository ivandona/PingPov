var mongoose = require('mongoose');
var Schema = mongoose.Schema;


module.exports = mongoose.model('Torneo', new Schema({
    nome_torneo: String,
    data: Date,
    organizzatore: String,
    sede: { type: String, enum: ['Povo1', 'Povo0'] },
    max_partecipanti: Number,
    giocatori: [String],
    risultati: [String]
}));