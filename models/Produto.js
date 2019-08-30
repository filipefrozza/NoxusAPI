var mongoose = require('mongoose');

var ProdutoSchema = new mongoose.Schema({
    nome: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    categorias: {
        type: Array
    },
    img: String,
    peso: {
        type: Number,
        required: true
    },
    preco: {
        type: Number,
        required: true
    },
    estoque: {
        type: Number,
        required: true
    },
    descricao: String,
    habilitado: {
        type: Boolean,
        required: true
    }, 
    destaque: Boolean,
    fisico: {
        type: Boolean,
        required: true
    },
    updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Produto', ProdutoSchema);
