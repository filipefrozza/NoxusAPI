var express = require('express');
var router = express.Router();
var pagarmeController  = require('../controller/pagarme-controller');
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

router.post('/adicionar-fundos', passport.authenticate('jwt', { session: false }), (req, res) => {
    console.log(req);
    pagarmeController.adicionarFundos(req.body.valor, req.user, req.body.cartao, res);
});

router.get('/teste', function(req, res, next){
    res.json({});
});

module.exports = router;
