var Carteira = require('../models/Carteira');

Carteira.alterarSaldo = (user, value) => {
    return new Promise(resolve => {
        Carteira.findOne({cliente: user.id}, (err, carteira) => {
            if(err) resolve({err: err});
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

Carteira.adicionarCartao = (user, cartao) => {
    return new Promise(resolve => {
        Carteira.findOne({cliente: user.id}, (err, carteira) => {
            if(err) resolve({err: err});
            
        });
    });
};