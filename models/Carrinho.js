var mongoose = require('mongoose');

var CarrinhoSchema = new mongoose.Schema({
    items: Array,
    cupom: String,
    cliente: {
        type: mongoose.Schema.ObjectId,
        ref: 'Cliente',
        required: true
    },
    // cliente: mongoose.Schema.ObjectId,
    updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Carrinho', CarrinhoSchema);