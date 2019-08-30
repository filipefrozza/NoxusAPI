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
    ordem: {
        type: Number
    },
    destaque: {
        type: Boolean
    },
    updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('categoria', CategoriaSchema);