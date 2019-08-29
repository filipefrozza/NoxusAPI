var Movimentacao = require('../models/Movimentacao');

Movimentacao.save = (movimentacao, res) => {
    Movimentacao.findOne({_id: movimentacao._id}, (err, mov) => {
        if(err) throw err;
        if(mov) {
            res.status(400).json({
                'msg': 'Já existe uma movimentacao com esse id'
            });
        } else{
            movimentacao = new Movimentacao(movimentacao);
            movimentacao.save((err, movimentacao) => {
                if(err) {
                    if(res){
                        return res.status(400).json({ 'msg': err });
                    }else{
                        return false;
                    }
                }
                if(res){
                    res.status(201).json(movimentacao);
                }else{
                    return true;
                }
            });
        }
    });
};

module.exports = Movimentacao;