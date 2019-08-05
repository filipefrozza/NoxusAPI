var express = require('express');
var router = express.Router();
var pagseguroController = require('../controller/pagseguro-controller.js');
var passport = require('passport');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.json({});
});

router.post('/notificacao', function(req, res, next){
    console.log(req.body);
});

router.post('/comprar', passport.authenticate('jwt', { session: false }), (req, res) => {
    pagseguroController.buildTransaction(
        req.body.items,
        req.user,
        req.body.cartao,
        res
    );
});

module.exports = router;
