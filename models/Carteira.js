var mongoose = require('mongoose');

var CarteiraSchema = mongoose.Schema({
    cliente: {
        type: mongoose.Schema.ObjectId,
        require: true
    },
    cartoes: Array,
    saldo: Number
});

module.exports = mongoose.model('Carteira', CarteiraSchema);