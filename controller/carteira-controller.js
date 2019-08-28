var Carteira = require('../models/Carteira');
var PagarmeController = require('../controller/pagarme-controller');

Carteira.getByCliente = (req, res) => {
    Carteira.findOne({cliente: req.user.id}, (err, carteira) => {
        if(err) res.status(400).json({err: err});
        if(!carteira){
            carteira = new Carteira({cliente: req.user.id, saldo: 0});
        }
        res.json(carteira);
    });
};

Carteira.alterarSaldo = (user, value) => {
    return new Promise(resolve => {
        Carteira.findOne({cliente: user.id}, (err, carteira) => {
            if(err) resolve({err: err});
            if(!carteira){
                carteira = new Carteira({cliente: user.id, saldo: 0});
            }
            carteira.saldo += value;
            carteira.save((err, carteira) => {
                if(err) resolve({err: err});
                if(carteira){
                    resolve(carteira);
                }
            });
        });
    });
};

/**
 * cartao: {
 *      card_number: required
 *      card_expiration_date: required
 *      card_holder_name: required,
 *      card_cvv: ?,
 *      customer_id: opt,
 *      card_hash: opt
 * }
 */
Carteira.adicionarCartao = (user, cartao) => {
    return new Promise(async resolve => {
        cartao.customer_id = user.id;
        card = await PagarmeController.createCard(cartao);
        console.log(card);
        return;
        Carteira.findOne({cliente: user.id}, (err, carteira) => {
            if(err) resolve({err: err});
            carteira.cards.push({cartao});
            carteira.save((err, carteira) => {
                if(err) resolve(err);
                resolve(carteira);
            });
        });
    });
};

module.exports = Carteira;