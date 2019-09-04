module.exports = (model) => {
    model.save = (req, res) => {
        var objeto = new model(req.body);
        objeto.save((err, objeto) => {
            if(err) res.status(400).json(err);
            if(objeto){
                res.status(201).json(objeto);
            }else{
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

    return model;
};