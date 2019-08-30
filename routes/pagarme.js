var express = require('express');
var router = express.Router();
var pagarmeController  = require('../controller/pagarme-controller');
var produtoController = require('../controller/produto-controller');
var carrinhoController = require('../controller/carrinho-controller');
var passport     = require('passport');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.json({});
});

router.post('/notificacao', function(req, res, next){
    console.log(req.body);
    var retorno = {
        status: req.body.status,
        boleto_url: req.body.transaction.boleto_url,
        boleto_barcode: req.body.transaction.boleto_barcode
    };
    io.emit('postback'+req.body.id, JSON.stringify(retorno));
    res.json(retorno);
});

router.post('/comprar', passport.authenticate('jwt', {session: false}), async (req, res) => {
    carrinhoController.getByCliente(req).then( async(carrinho) => {
        if(carrinho){
            carrinho.items = await produtoController.validateItems(carrinho.items);
            if(carrinho.items.erros){
                res.status(400).json({"msg": carrinho.items.erros});
            }else{
                // console.log('pegou', carrinho);
                // res.json(carrinho.items);
                // return;
                pagarmeController.buildTransaction(
                    carrinho.items,
                    req.user,
                    req.body.cartao,
                    res,
                    req
                );
            }
        }else{
            res.status(400).json({"msg": "Você não possui itens no seu carrinho"});
        }
    });

});

module.exports = router;
