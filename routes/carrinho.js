var express = require('express');
var router = express.Router();
var carrinhoController = require('../controller/carrinho-controller');
var passport = require('passport');

router.get('/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
    carrinhoController.getByCliente(req, res);
});

router.post('/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
    carrinhoController.addProduto(req, res);
});

router.post('/:id/cupom', passport.authenticate('jwt', {session: false}), (req, res) => {
    carrinhoController.addCupom(req, res);
});