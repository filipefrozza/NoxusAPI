exports.buildTransaction = (itens, cliente, res) => {
    var email = 'filipefrozza.fm@gmail.com';
    var token = 'BBF4FED3ED314578B5C31F72B816E33C';
    
    var pagSeguro = new PagSeguro(email, token);
    pagSeguro.setMode('sandbox');

    // url que tem q redirecionar
    // var URL_RED_PAG = 'https://pagseguro.uol.com.br/v2/checkout/payment.html?code=';

    total = 0;
    frete_total = 0;

    for(i in itens){
        pagSeguro.addItem({
            id: itens[i].id,
            description: itens[i].nome,
            amount: Number.parseFloat(itens[i].preco).toFixed(2),  // tem que ter 2 decimais no valor
            quantity: itens[i].quantidade,
            weight: itens[i].peso,   // em gramas
            shippingCost: Number.parseFloat(itens[i].frete).toFixed(2)  // msm criterio do valor
        });

        frete_total += itens[i].frete;
        total+=itens[i].preco;
    }

    billing = {
        "name": cliente.nome,
        "address": {
            "country": "br",
            "state": cliente.estado,
            "city": cliente.cidade,
            "neighborhood": cliente.bairro,
            "street": cliente.rua,
            "street_number": cliente.numero,
            "zipcode": cliente.cep.replace('-','')
        }
    };

    pagSeguro.addShipment({
        type: 3, //3 para frete indefinido
        state: cliente.estado,
        city: cliente.cidade,
        postalCode: cliente.cep.replace('-',''),
        district: cliente.bairro,
        street: cliente.rua,
        number: cliente.numero,
        complement: cliente.complemento,
        cost: Number.parseFloat(frete_total).toFixed(2)
    });

    pagSeguro.addBuyer({
        email: cliente.email,
        name: cliente.nome, // Tem que ter 2 nomes, wtf
        areaCode: +cliente.telefone.replace(/(\(|\)|\s|\-)/g,'').substr(0,2)
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
};