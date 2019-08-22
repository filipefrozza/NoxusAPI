var mongoose = require('mongoose');

var TransacaoSchema = new mongoose.Schema({
    total: {
        type: Number,
        require: true
    },
    items: {
        type: Array,
        require: true
    },
    cliente: {
        type: mongoose.Schema.ObjectId,
        require: true
    },
    metodo: {
        type: String,
        require: true
    },
    status: {
        type: String,
        require: true
    },
    tid: {
        type: Number
    },
    referencia: {
        type: String
    },
    plataforma: {
        type: String,
        require: true
    },
    cupom: {
        type: Array
    },
    desconto: {
        type: Number,
        default: 0
    },
    boleto: {
        type: Object
    },
    updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Transacao', TransacaoSchema);