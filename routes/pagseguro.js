var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.json({});
});

router.post('/notificacao', function(req, res, next){
    console.log(req.body);
});

router.get('/teste', function(req, res, next){
    var email = 'filipefrozza.fm@gmail.com';
    var token = 'BBF4FED3ED314578B5C31F72B816E33C';

    var PagSeguro = require('pagseguro-node');
    var pagSeguro = new PagSeguro(email, token);
    pagSeguro.setMode('sandbox');

    // provide redirect URL after PagSeguro sends you the transaction code
    // var URL_RED_PAG = 'https://pagseguro.uol.com.br/v2/checkout/payment.html?code=';

    pagSeguro.addItem({
        id: 1,
        description: 'Item description 1',
        amount: '20.00',  // values in string format with 2 decimal places
        quantity: 1,
        weight: 1200,   // in grams
        shippingCost: '0.00'  // same criterion
    });

    // shipment depends on options set in PagSeguro store page.
    // make sure you set them and read the API
    pagSeguro.addShipment({
        type: 3,
        state: 'BA',
        city: 'Jacobina',
        postalCode: '44700000',
        district: 'Um bairro',
        street: 'Rua x',
        number: '999',
        complement: 'Casa',
        cost: '0.00'
    });

    pagSeguro.addBuyer({
        email: 'buyer_email@email.com',
        name: 'Bruno Pinho', // you must provide at least 2 names, don't know why!
        areaCode: '74'
    });

    pagSeguro.processOrder(function (err, response, body) {
    
        if (err) {
            res.json(err);
        }
        else {
            // redirect user to payment page (pagseguro)
            res.json(body);
            // res.redirect(URL_RED_PAG + body.code);      
        }   
    
    });

    // pag = new pagseguro({
    //     email : 'filipefrozza.fm@gmail.com',
    //     token: 'BBF4FED3ED314578B5C31F72B816E33C',
    //     mode: 'sandbox'
    // });

    // //Configurando a moeda e a referência do pedido
    // pag.currency('BRL');
    // pag.reference('20');

    // //Adicionando itens
    // pag.addItem({
    //     id: 20,
    //     description: '20 reais de saldo',
    //     amount: "20.00",
    //     quantity: 3,
    //     weight: 2342
    // });

    // //Configurando as informações do comprador
    // pag.buyer({
    //     name: 'Gabriel Linck',
    //     email: 'gabriel.jobc13@gmail.com',
    //     phoneAreaCode: '51',
    //     phoneNumber: '980420983'
    // });

    // //Configurando a entrega do pedido

    // pag.shipping({
    //     type: 1,
    //     street: 'Rua Alameda dos Anjos',
    //     number: '367',
    //     complement: 'Apto 307',
    //     district: 'Parque da Lagoa',
    //     postalCode: '01452002',
    //     city: 'São Paulo',
    //     state: 'RS',
    //     country: 'BRA'
    // });

    // //Configuranto URLs de retorno e de notificação (Opcional)
    // //ver https://pagseguro.uol.com.br/v2/guia-de-integracao/finalizacao-do-pagamento.html#v2-item-redirecionando-o-comprador-para-uma-url-dinamica
    // // pag.setRedirectURL("http://35.236.73.207");
    // // pag.setNotificationURL("http://www.lojamodelo.com.br/notificacao");

    // console.log(pag);

    // //Enviando o xml ao pagseguro
    // pag.send(function(err, data) {
    //     if (err) {
    //         console.log(err);
    //     }
    //     console.log(data);
    //     res.json({
    //         err: err,
    //         data: data
    //     });
    // });
});

module.exports = router;
