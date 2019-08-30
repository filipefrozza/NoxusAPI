var Categoria = require('../models/Categoria');

Categoria.save = (req, res) => {
    var categoria = new Categoria(req.body);
    categoria.save((err, categoria) => {
        if(err) res.status(400).json(err);
        if(categoria){
            res.status(201).json(categoria);
        }else{
            res.status(400).json({msg: "Não foi possível salvar"});
        }
    });
};

Categoria.delete = (req, res) => {
    Categoria.findById(req.params.id, (err, categoria) => {
        if(err) res.status(400).json(err);
        if(categoria){
            categoria.remove();
            res.json({removido: true});
        }else{
            res.status(400).json({msg: "Não existe essa categoria"});
        }
    });
};

Categoria.getAll = (req, res) => {
    Categoria.find({}, (err, categorias) => {
        if(err) res.status(400).json(err);
        if(categorias){
            res.json(categorias);
        }else{
            res.status(404).json({msg: "Não foram encontradas categorias"});
        }
    });
};

Categoria.getById = (req, res) => {
    Categoria.findById(req.params.id, (err, categoria) => {
        if(err) res.status(400).json(err);
        if(categoria){
            res.json(categoria);
        }else{
            res.status(404).json({msg: "Categoria não encontrada"});
        }
    });
};