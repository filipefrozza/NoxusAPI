var express = require('express');
var router = express.Router();
var categoriaController = require('../controller/categoria-controller');
var passport = require('passport');
var requireAdmin = require('../middleware/requireAdmin');

router.get('/', categoriaController.getAll);

router.post('/', passport.authenticate('jwt', {session: false}), (req, res) => {
    if(requireAdmin(req, res)){
        categoriaController.save(req, res);
    }
});

module.exports = router;