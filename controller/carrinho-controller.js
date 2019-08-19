var Carrinho = require('../models/Carrinho');

Carrinho.getByCliente = (req, res, next) => {
    try{
        Carrinho.findOne({cliente: req.user.id}, (err, carrinho) => {
            if(err) return next(err);
            res.json(carrinho);
        });
    }catch(e){
        json.status(400).json({'msg': 'Id inválido'});
    }
};

Carrinho.addProduto = (req, res, next) => {
    res.json({});
};

Carrinho.addCupom = (req, res, next) => {
    res.json({});
};