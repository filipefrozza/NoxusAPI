var Usuario = require('../models/Usuario');
var jwt = require('jsonwebtoken');
var config = require('../config/config');
var bcrypt = require('bcrypt');
var nodemailer = require('nodemailer');
 
function createToken(usuario) {
    return jwt.sign({ id: usuario.id, email: usuario.email }, config.jwtSecret, {
        expiresIn: 3600 // 86400 expires in 24 hours
      });
}
 
exports.register = (req, res) => {
    if(req.body.admin){
        delete req.body.admin;
    }

    if (!req.body.login || !req.body.senha) {
        return res.status(400).json({ 'msg': 'Você deve mandar o login e senha' });
    }
 
    Usuario.findOne({ usuario: req.body.login }, (err, usuario) => {
        if (err) {
            return res.status(400).json({ 'msg': err });
        }
 
        if (usuario) {
            return res.status(400).json({ 'msg': 'O usuário já existe' });
        }
 
        let newUsuario = Usuario(req.body);
        newUsuario.save((err, usuario) => {
            if (err) {
                return res.status(400).json({ 'msg': err });
            }

            usuario.senha = undefined;
            usuario.resetPasswordExpires = undefined;
            usuario.resetPasswordToken = undefined;

            return res.status(201).json({
                token: createToken(usuario),
                usuario: usuario
            });
        });
    });
};

exports.edit = (req, res) => {
    if (!req.body.senha) {
        console.log(req.body);
        return res.status(400).json({ 'msg': 'Você deve preencher a senha' });
    }
 
    Usuario.findOne({ usuario: req.user.login }, (err, usuario) => {
        if (err) {
            return res.status(400).json({ 'msg': err });
        }
 
        if (!usuario) {
            return res.status(400).json({ 'msg': 'Erro ao atualizar, relogue para tentar novamente' });
        }

        usuario.comparePassword(req.body.senha, (err, isMatch) => {
            delete usuario.senha;
            if (isMatch && !err) {
                for(attr in req.body){
                    usuario[attr] = req.body[attr];
                }
                console.log(usuario);
                // let newUsuario = Usuario(req.body);
                usuario.save((err, usuario) => {
                    if (err) {
                        return res.status(400).json({ 'msg': err });
                        console.log(err);
                    }

                    delete usuario.senha;

                    return res.status(201).json({
                        'msg': 'Atualizado com sucesso'
                    });
                });
            } else {
                return res.status(400).json({ 'msg': 'Senha inválida' });
            }
        });
    });
};
 
exports.login = (req, res) => {
    if (!req.body.login || !req.body.senha) {
        return res.status(400).send({ 'msg': 'Você deve preencher seu login e senha' });
    }
 
    Usuario.findOne({ usuario: req.body.login }, (err, usuario) => {
        if (err) {
            return res.status(400).send({ 'msg': err });
        }
 
        if (!usuario) {
            return res.status(400).json({ 'msg': 'O login não existe' });
        }
 
        usuario.comparePassword(req.body.senha, (err, isMatch) => {
            usuario.senha = undefined;
            usuario.resetPasswordExpires = undefined;
            usuario.resetPasswordToken = undefined;
            if (isMatch && !err) {
                return res.status(200).json({
                    token: createToken(usuario),
                    usuario: usuario
                });
            } else {
                return res.status(400).json({ 'msg': 'O login/senha não bate' });
            }
        });
    });
};

exports.forgotPassword = async (req, res) => {
    if(!req.body.email){
        console.log('Você deve preencher o email');
        return res.status(400).send({'msg': 'Você deve preencher o email'});
    }

    await Usuario.findOne({email: req.body.email}, async (err, usuario) => {
        if(!usuario) {
            console.log('Não existe nenhuma conta com esse email');
            return res.status(400).send({'msg': 'Não existe nenhuma conta com esse email'});
        }

        await bcrypt.genSalt(10, async (err, salt) => {
            if (err) return next(err);
    
            await bcrypt.hash(Date.now()+'', salt, async (err, hash) => {
                if (err) return console.log(err);
    
                usuario.resetPasswordToken = hash;
                console.log('Token '+hash+' gerado para '+usuario.email);
                usuario.resetPasswordExpires = Date.now() + 1800000; // 30 minutos

                let newUsuario = Usuario(usuario);

                await newUsuario.save(async (err, usuario) => {
                    if (err) {
                        console.log(err);
                        return res.status(400).send({ 'msg': err });
                    }
        
                    console.log('salvando token para '+usuario.email);
                    var smtpTransport = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                            user: 'frozzateste@gmail.com',
                            pass: '#teste123'
                        }
                    });
                    
                    var mailOptions = {
                        to: usuario.email,
                        from: 'passwordreset@brazilianbet.com',
                        subject: 'Recuperação de senha',
                        text: 'Você está recebendo esse email porque você (ou talvez outra pessoa) solicitou recuperação de senha no site da Brazilian Bet.\n\n' +
                        'Por favor clique no link abaixo ou copie e cole no navegador:\n\n' +
                        'http://localhost:3000/auth/passwordRecover/' + usuario.resetPasswordToken + '\n\n' +
                        'Se você não requisitou isso, por favor ignore este email.\n'
                    };
            
                    await smtpTransport.sendMail(mailOptions).then((p) => {
                        if(p.response.substr(0,3) != '250'){
                            console.log(err);
                            return res.status(400).json({'msg': 'Falha ao enviar email'});
                        }else{
                            console.log("enviando email");
                            return res.status(201).json({'msg': 'Um email foi enviado para ' + usuario.email + ' com as instruções de recuperação!'});
                        }
                    }).catch((err) => {
                        console.log(err);
                    });
                });
            });
        });
        

    });
};

exports.checkForgotToken = async (req, res) => {
    if(!req.body.token){
        return res.status(400).json({'msg': 'Você precisa de um token de redefinição de senha'});
    }

    console.log("checkando token "+req.body.token);

    Usuario.findOne({ resetPasswordToken: req.body.token,  resetPasswordExpires: { $gt: Date.now() } }, (err, usuario) => {
        if (err) {
            return res.status(400).send({ 'msg': err });
        }
 
        if (!usuario) {
            return res.status(400).json({ 'msg': 'Esse token é inválido ou já expirou' });
        }
 
        return res.status(200).send({'msg': 'Token válido', "usuario": usuario.apelido});
    });
};

exports.resetForgotPassword = async (req, res) => {
    if(!req.body.token && !req.body.senha){
        return res.status(400).json({'msg': 'Você precisa de um token e uma senha para redefinir'});
    }

    Usuario.findOne({ resetPasswordToken: req.body.token,  resetPasswordExpires: { $gt: Date.now() } }, (err, usuario) => {
        if (err) {
            return res.status(400).send({ 'msg': err });
        }
 
        if (!usuario) {
            return res.status(400).json({ 'msg': 'Esse token é inválido ou já expirou' });
        }

        usuario.senha = req.body.senha;

        let newUsuario = Usuario(usuario);
 
        newUsuario.save((err, usuario) => {
            if (err) {
                return res.status(400).json({ 'msg': err });
                console.log(err);
            }

            delete usuario.senha;

            return res.status(201).json({
                
            });
        });        
    });
};

exports.alterar = (req, res) => {
    if (!req.body.senha) {
        console.log(req.body);
        return res.status(400).json({ 'msg': 'Você deve preencher a senha' });
    }
 
    Usuario.findOne({ usuario: req.params.id }, (err, usuario) => {
        if (err) {
            return res.status(400).json({ 'msg': err });
        }
 
        if (!usuario) {
            return res.status(400).json({ 'msg': 'Erro ao atualizar, relogue para tentar novamente' });
        }

        for(attr in req.body){
            usuario[attr] = req.body[attr];
        }

        usuario.save((err, usuario) => {
            if (err) {
                return res.status(400).json({ 'msg': err });
            }

            delete usuario.senha;

            return res.status(201).json({
                'msg': 'Atualizado com sucesso'
            });
        });
    });
};

exports.deletar = (req, res) => {
    Usuario.findByIdAndRemove(req.params.id, req.body, function (err, post) {
        if (err) return res.status(400).json({'msg': err});
        res.status(200).json({'msg': 'deletado', 'dados': 'post'});
    });
};