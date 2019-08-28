var express = require('express');
var router = express.Router();
var carrinhoController = require('../controller/carrinho-controller');
var passport = require('passport');

router.get('/', passport.authenticate('jwt', {session: false}), (req, res) => {
    carrinhoController.getByCliente(req, res);
});

router.post('/', passport.authenticate('jwt', {session: false}), (req, res) => {
    carrinhoController.addProduto(req, res);
});

router.delete('/', passport.authenticate('jwt', {session: false}), (req, res) => {
    carrinhoController.limpar(req, res);
});

router.post('/cupom', passport.authenticate('jwt', {session: false}), (req, res) => {
    carrinhoController.addCupom(req, res);
});

module.exports = router;