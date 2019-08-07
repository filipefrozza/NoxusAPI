var Produto = require('../models/Produto');

Produto.getDestaques = function(req, res, next){
    Produto.find({destaque: true, habilitado: true}, (err, produtos) => {
        if(err) return next(err);
        res.json(produtos);
    });
}

module.exports = Produto;