var Transacao = require('../models/Transacao');

exports.save = (tran, res) => {
    return new Promise(resolve => {
        transacao = new Transacao(tran);
        transacao.save((err, transacao) => {
            if(err) {
                if(res){
                    return resolve(false);
                }
                return res.status(400).json({ 'msg': err });
            }
            if(res){
                return resolve(transacao.id);
            }
            res.status(201).json(transacao);
        });
    });
};

// exports.update = (req, res) => {
//     Transacao.findByIdAndUpdate(req.params.id, req.body, function (err, put) {
//         if (err) return next(err);
//         res.json(put);
//     });
// };

exports.get = (req, res) => {
    Transacao.findById(req.params.id, (err, tran) => {
        if(err) return res.status(400).json({'msg': err});
        res.json(tran);
    });
};

exports.getAll = (req, res) => {
    Transacao.find({}, (err, trans) => {
        res.json(trans);
    });
};