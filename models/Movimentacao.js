var mongoose = require('mongoose');

var MovimentacaoSchema = new mongoose.Schema({
    produto: mongoose.Schema.ObjectId,
    quantidade: Number,
    data: Date,
    origem: String,
    valor: Number,
    confirmado: Boolean,
    updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Movimentacao', MovimentacaoSchema);