var express = require('express');
var router = express.Router();
var produto = require('../controller/produto-controller');
var Produto = require('../models/Produto');
var passport     = require('passport');
var requireAdmin = require('../middleware/requireAdmin');

router.get('/', function (req, res, next) {
    Produto.find(function (err, produtos) {
        if (err) return next(err);
        res.json(produtos);
    });
});

router.get('/destaques', produto.getDestaques);

router.get('/:id', function (req, res, next) {
    Produto.findById(req.params.id, function (err, produto) {
        if (err) return next(err);
        res.json(produto);
    });
});

router.post('/', passport.authenticate('jwt', {session: false}), (req, res) => {
    if(requireAdmin(req, res)){
        produto.save(req, res);
    }
});

router.post('/', passport.authenticate('jwt', {session: false}), (req, res) => {
    if(requireAdmin(req, res)){
        produto.save(req, res);
    }
});

/* UPDATE TIME */
router.put('/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
    if(requireAdmin(req, res)){
        produto.update(req, res);
    }
});

/* DELETE TIME */
router.delete('/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
    if(requireAdmin(req, res)){
        produto.delete(req, res);
    }
});

module.exports = router;
