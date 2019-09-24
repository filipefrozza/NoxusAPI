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
    acessos: {
        type: Number,
        default: 0
    },
    textColor: {
        type: String,
        default: 'black',
        lowercase: true,
        trim: true
    },
    updated_at: { type: Date, default: Date.now }
});

CategoriaSchema.pre('save', next => {
    var categoria = this;
    if(!categoria.ordem){
        CategoriaSchema.find({}).sort({ordem: -1}).limit(1).exec((err, ultima) => {
            if(err) next(err);
            categoria.ordem = ultima.ordem+1;
            next();
        });
    }else{
        next();
    }
});

module.exports = mongoose.model('categoria', CategoriaSchema);