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
    let retorno = [];
    await items.forEach( async (i, k) => {
        // await Produto.findById(i.id, async (err, produto) => {
        //     if(err) return retorno.erros?retorno.erros.push(err):retorno.erros=[err];
        //     if(!produto) return retorno.erros?retorno.erros.push("Produto "+i.id+" não existe"):retorno.erros=["Produto "+i.id+" não existe"];
        //     produto.quantidade = i.quantidade;
        //     retorno.push(produto);
        // });
        await new Promise(async resolve => {
            produto = await Produto.findById(i.id);
            produto.quantidade = i.quantidade;
            resolve(produto);
        });
        if(!produto) return retorno.erros?retorno.erros.push("Produto "+i.id+" não existe"):retorno.erros=["Produto "+i.id+" não existe"];
        retorno.push(produto);
        console.log(produto);
    });
    await setTimeout(() => {}, 300);
    return retorno;
};

module.exports = Produto;