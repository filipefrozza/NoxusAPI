var Produto = require('../models/Produto');

Produto.getDestaques = function(req, res, next){
    Produto.find({destaque: true, habilitado: true}, (err, produtos) => {
        if(err) return next(err);
        res.json(produtos);
    });
}

Produto.save = (req, res) => {
    Produto.findOne({_id: req.body._id}, (err, produto) => {
        if(err) throw err;
        if(produto) {
            res.status(400).json({
                'msg': 'Já existe um produto com esse id'
            });
        } else{
            produto = new Produto(req.body);
            produto.save((err, produto) => {
                if(err) {
                    return res.status(400).json({ 'msg': err });
                }
                res.status(201).json(produto);
            });
        }
    });
};

Produto.update = (req, res) => {
    produto.findByIdAndUpdate(req.params.id, req.body, function (err, put) {
        if (err) return next(err);
        res.json(put);
    });
};

Produto.delete = (req, res) => {
    produto.findByIdAndRemove(req.params.id, req.body, function (err, del) {
        if (err) return next(err);
        res.json(del);
    });
};

Produto.validateItems = async (items) => {
    return new Promise(async resolve => {
        let ret = [];
        items.forEach( async (i, k) => {
            try{
                produto = await Produto.findById(i.id);
                produto.quantidade = i.quantidade;
                if(!produto) return ret.erros?ret.erros.push("Produto "+i.id+" não existe"):ret.erros=["Produto "+i.id+" não existe"];
                ret.push(produto);
            }catch(e){
                ret.erros?ret.erros.push("ID "+i.id+" inválido"):ret.erros=["ID "+i.id+" inválido"];
            }
            if(k == items.length - 1){
                resolve(ret);
            }
        });
    });
};

module.exports = Produto;