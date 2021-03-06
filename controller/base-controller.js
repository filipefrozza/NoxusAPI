module.exports = (model) => {
    model.save = (req, res) => {
        console.log('entrou save');
        var objeto = new model(req.body);
        objeto.save((err, objeto) => {
            console.log('entrou save object');
            if(err) res.status(400).json(err);
            if(objeto){
                console.log('entrou é objeto');
                res.status(201).json(objeto);
            }else{
                console.log('entrou 404');
                res.status(400).json({msg: "Não foi possível salvar"});
            }
        });
    };

    model.update = (req, res) => {
        model.findByIdAndUpdate(req.params.id, req.body, function (err, put) {
            if (err) return next(err);
            res.json(put);
        });
    };
    
    model.delete = (req, res) => {
        model.findById(req.params.id, (err, objeto) => {
            if(err) res.status(400).json(err);
            if(objeto){
                objeto.remove();
                res.json({removido: true});
            }else{
                res.status(400).json({msg: "Não existe registro com esse id"});
            }
        });
    };
    
    model.getAll = (req, res) => {
        model.find({}, (err, objeto) => {
            if(err) res.status(400).json(err);
            if(objeto){
                res.json(objeto);
            }else{
                res.status(404).json({msg: "Não foram encontrados registros"});
            }
        });
    };
    
    model.getById = (req, res) => {
        model.findById(req.params.id, (err, objeto) => {
            if(err) res.status(400).json(err);
            if(objeto){
                res.json(objeto);
            }else{
                res.status(404).json({msg: "Id não encontrado"});
            }
        });
    };

    model.getByFlag = (flag, val, req, res) => {
        let search = [];
        search[flag] = val;
        model.find(search, (err, objetos) => {
            if(err) res.status(400).json(err);
            if(objetos){
                res.json(objetos);
            }else{
                res.status(404).json({msg: "Não foram encontrados registros"})
            }
        });
    };

    model.getByRelevancia = (req, res) => {
        model.find({}).sort({relevancia: -1}).limit(3).exec((err, objetos) => {
            if(err) res.status(400).json(err);
            if(objetos) {
                res.json(objetos);
            }else{
                res.status(404).json({msg: "Não foram encontrados registros"});
            }
        });
    };

    return model;
};