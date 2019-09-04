var mongoose = require('mongoose');

var CategoriaSchema = mongoose.Schema({
    nome: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    url: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    img: {
        type: String,
        required: true
    },
    ordem: {
        type: Number,
        default: null
    },
    destaque: {
        type: Boolean,
        default: false
    },
    relevancia: {
        type: Number,
        default: 0
    },
    updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('categoria', CategoriaSchema);