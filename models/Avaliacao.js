var mongoose = require('mongoose');

var Avaliacao = mongoose.Schema({
    cliente: mongoose.Schema.ObjectId,
    produto: mongoose.Schema.ObjectId,
    nota: {
        type: Number,
        required: true,
        max: 5,
        min: 0
    },
    uploaded_at: {type: Date, default: Date.now()}
});