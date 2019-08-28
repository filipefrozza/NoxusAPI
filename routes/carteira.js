var express = require('express');
var router = express.Router();
var carteiraController = require('../controller/carteira-controller');
var passport = require('passport');

router.get('/', passport.authenticate('jwt', {session: false}), (req, res) => {
    carteiraController.getByCliente(req, res);
});

module.exports = router;