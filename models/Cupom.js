var mongoose = require('mongoose');

var CupomSchema = mongoose.Schema({
    codigo: {
        type: String,
        required: true
    },
    tipo: {
        type: String,
        required: true
    },
    valor: {
        type: Number,
        required: true
    },
    habilitado: {
        type: Boolean,
        required: true
    },
    expire_at: Date,
    updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Cupom', CupomSchema);