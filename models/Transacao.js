var mongoose = require('mongoose');

var TransacaoSchema = new mongoose.Schema({
    total: Number,
    items: Array,
    cliente: mongoose.Schema.ObjectId,
    metodo: String,
    status: String,
    tid: Number,
    referencia: String,
    plataforma: String,
    cupom: String,
    desconto: Number,
    updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Transacao', TransacaoSchema);