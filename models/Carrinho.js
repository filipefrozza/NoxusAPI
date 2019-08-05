var mongoose = require('mongoose');

var CarrinhoSchema = new mongoose.Schema({
    items: Array,
    cupom: String,
    updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Carrinho', CarrinhoSchema);