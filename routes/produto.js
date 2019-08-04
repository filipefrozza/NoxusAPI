var express = require('express');
var router = express.Router();
var produto = require('../controller/produto-controller');
var Produto = require('../models/Produto');
var Cliente = require('../models/Cliente');

/* GET ALL TIME */
router.get('/', function (req, res, next) {
    Produto.find(function (err, produtos) {
        if (err) return next(err);
        res.json(produtos);
    });
});

/* GET SINGLE TIME BY ID */
router.get('/:id', function (req, res, next) {
    Produto.findById(req.params.id, function (err, produto) {
        if (err) return next(err);
        res.json(produto);
    });
});


/* SAVE TIME */
// router.post('/', function (req, res, next) {
//     Time.create(req.body, function (err, post) {
//         if (err) return next(err);
//         res.json(post);
//     });
// });

/* UPDATE TIME */
// router.put('/:id', function (req, res, next) {
//     Time.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
//         if (err) return next(err);
//         res.json(post);
//     });
// });

/* DELETE TIME */
// router.delete('/:id', function (req, res, next) {
//     Time.findByIdAndRemove(req.params.id, req.body, function (err, post) {
//         if (err) return next(err);
//         res.json(post);
//     });
// });

module.exports = router;
