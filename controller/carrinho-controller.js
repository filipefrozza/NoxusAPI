var Carrinho = require('../models/Carrinho');

Carrinho.getByCliente = (req, res) => {
    return new Promise((resolve) => {
        try{
            Carrinho.findOne({cliente: req.user.id}, (err, carrinho) => {
                if(err) throw err;
                if(res){
                    res.json(carrinho==null?{}:carrinho);
                }else{
                    resolve(carrinho);
                }
            });
        }catch(e){
            json.status(400).json({'msg': 'Id inválido'});
        }
    });
};

Carrinho.addProduto = (req, res, next) => {
    var addProdutoArray = (produto, items) => {
        var tem = false;
        items.map((v, k) => {
            if(produto.id = v.id){
                tem = true;
                items.set(k,{id: v.id, quantidade: v.quantidade + produto.quantidade});
            }
        });
        if(!tem){
            items.push({
                id: req.body.id,
                quantidade: req.body.quantidade
            });
        }
        return items;
    };
    try{
        Carrinho.findOne({cliente: req.user.id}, (err, carrinho) => {
            if(err) return next(err);
            if(carrinho){
                carrinho.items = addProdutoArray(req.body, carrinho.items);
                console.log(carrinho);
                carrinho.save((err, carrinho) => {
                    if(err) next(err);
                    res.status(201).json(carrinho);
                });
            }else{
                var novoCarrinho = Carrinho({
                    cliente: req.user.id,
                    items: [{
                        id: req.body.id,
                        quantidade: req.body.quantidade
                    }]
                });
                novoCarrinho.save((err, carrinho) => {
                    if(err) next(err);
                    res.status(201).json(carrinho);
                });
            }
        });
    }catch(e){
        return console.log(e);
    }
};

Carrinho.addCupom = (req, res, next) => {
    res.json({});
};

Carrinho.limpar = (req, res, next) => {
    return new Promise((resolve) => {
        try{
            Carrinho.findOne({cliente: req.user.id}, (err, carrinho) => {
                if(err) throw err;
                if(carrinho){
                    carrinho.remove();
                    res.status(200).json({});
                }else{
                    res.status(404).json({});
                }
            });
        }catch(e){
            json.status(400).json({'msg': 'Id inválido'});
        }
    });
};

module.exports = Carrinho;