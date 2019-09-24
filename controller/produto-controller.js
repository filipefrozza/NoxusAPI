var Produto = require('../models/Produto');
var Base = require('./base-controller');

Produto.getDestaques = function(req, res, next){
    Produto.find({destaque: true, habilitado: true}, (err, produtos) => {
        if(err) return next(err);
        res.json(produtos);
    });
}

Produto.getPromocao = (req, res) => {
    Produto.find({promocao: {$ne: null}}, (err, produtos) => {
        if(err) res.status(400).json(err);
        if(produtos) {
            res.json(produtos);
        }else{
            res.status(404).json({msg: "Não há registros em promoção"});
        }
    });
};

Produto.validateItems = async (items) => {
    return new Promise(async resolve => {
        let ret = [];
        if(items){
            items.forEach( async (i, k) => {
                try{
                    produtoMongo = await Produto.findById(i.id);
                    var produto = JSON.parse(JSON.stringify(produtoMongo));
                    produto.quantidade = i.quantidade;
                    if(!produto) return ret.erros?ret.erros.push("Produto "+i.id+" não existe"):ret.erros=["Produto "+i.id+" não existe"];
                    ret.push(produto);
                }catch(e){
                    ret.erros?ret.erros.push("ID "+i.id+" inválido"):ret.erros=["ID "+i.id+" inválido"];
                }finally{
                    if(k == items.length - 1){
                        resolve(ret);
                    }
                }
            });
        }else{
            ret.erros = ["Carrinho vazio"];
            resolve(ret);
        }
    });
};

module.exports = Base(Produto);