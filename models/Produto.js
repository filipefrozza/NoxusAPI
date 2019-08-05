var mongoose = require('mongoose');

var ProdutoSchema = new mongoose.Schema({
    nome: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    img: String,
    peso: Number,
    preco: Number,
    estoque: Number,
    descricao: String,
    habilitado: Boolean,
    updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Produto', ProdutoSchema);
