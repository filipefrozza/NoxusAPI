var express = require('express');
var router = express.Router();
var categoriaController = require('../controller/categoria-controller');
var passport = require('passport');
var requireAdmin = require('../middleware/requireAdmin');

router.get('/', categoriaController.getAll);

router.post('/', passport.authenticate('jwt', {session: false}), (req, res) => {
    console.log('entrou post');
    if(requireAdmin(req, res)){
        console.log('entrou admin');
        categoriaController.save(req, res);
    }
});

router.get('/destaques', (req, res) => {
    categoriaController.getByFlag('destaques', true, req, res);
});

router.get('/relevante', (req, res) => {
    categoriaController.getByRelevancia(req, res);
});

module.exports = router;