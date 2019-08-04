var Cliente = require('../models/Cliente');
var jwt = require('jsonwebtoken');
var config = require('../config/config');
var bcrypt = require('bcrypt');
var nodemailer = require('nodemailer');
 
function createToken(cliente) {
    return jwt.sign({ id: cliente.id, email: cliente.email }, config.jwtSecret, {
        expiresIn: 3600 // 86400 expires in 24 hours
      });
}
 
exports.register = (req, res) => {
    if(req.body.c_senha){
        delete req.body.c_senha;
    }
    if(typeof req.body.disabled != undefined){
        delete req.body.disabled;
    }

    console.log(req.body);

    if (!req.body.usuario || !req.body.senha) {
        return res.status(400).json({ 'msg': 'Você deve mandar o usuário e senha' });
        console.log("você deve mandar o usuario e a senha");
    }
 
    Cliente.findOne({ usuario: req.body.usuario }, (err, cliente) => {
        if (err) {
            return res.status(400).json({ 'msg': err });
            console.log(err);
        }
 
        if (cliente) {
            return res.status(400).json({ 'msg': 'O usuário já existe' });
            console.log("usuario ja existe");
        }
 
        let newCliente = Cliente(req.body);
        newCliente.save((err, cliente) => {
            if (err) {
                return res.status(400).json({ 'msg': err });
                console.log(err);
            }

            cliente.senha = undefined;
            cliente.resetPasswordExpires = undefined;
            cliente.resetPasswordToken = undefined;

            return res.status(201).json({
                token: createToken(cliente),
                cliente: cliente
            });
        });
    });
};

exports.edit = (req, res) => {
    if(typeof req.body.disabled != undefined){
        delete req.body.disabled;
    }

    // console.log(req.body);

    if (!req.body.senha) {
        console.log(req.body);
        return res.status(400).json({ 'msg': 'Você deve preencher a senha' });
        console.log("você deve preencher a senha");
    }
 
    Cliente.findOne({ usuario: req.user.usuario }, (err, cliente) => {
        if (err) {
            return res.status(400).json({ 'msg': err });
            console.log(err);
        }
 
        if (!cliente) {
            return res.status(400).json({ 'msg': 'Erro ao atualizar, relogue para tentar novamente' });
            console.log("usuario ja existe");
        }

        cliente.comparePassword(req.body.senha, (err, isMatch) => {
            delete cliente.senha;
            if (isMatch && !err) {
                for(attr in req.body){
                    cliente[attr] = req.body[attr];
                }
                console.log(cliente);
                // let newcliente = cliente(req.body);
                cliente.save((err, cliente) => {
                    if (err) {
                        return res.status(400).json({ 'msg': err });
                        console.log(err);
                    }

                    delete cliente.senha;

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
    if (!req.body.usuario || !req.body.senha) {
        return res.status(400).send({ 'msg': 'Você deve preencher seu usuário e senha' });
    }
 
    Cliente.findOne({ usuario: req.body.usuario }, (err, cliente) => {
        if (err) {
            return res.status(400).send({ 'msg': err });
        }
 
        if (!cliente) {
            return res.status(400).json({ 'msg': 'O usuário não existe' });
        }
 
        cliente.comparePassword(req.body.senha, (err, isMatch) => {
            cliente.senha = undefined;
            cliente.resetPasswordExpires = undefined;
            cliente.resetPasswordToken = undefined;
            if (isMatch && !err) {
                return res.status(200).json({
                    token: createToken(cliente),
                    cliente: cliente
                });
            } else {
                return res.status(400).json({ 'msg': 'O usuário/senha não bate' });
            }
        });
    });
};

exports.forgotPassword = async (req, res) => {
    if(!req.body.email){
        console.log('Você deve preencher o email');
        return res.status(400).send({'msg': 'Você deve preencher o email'});
    }

    await cliente.findOne({email: req.body.email}, async (err, cliente) => {
        if(!cliente) {
            console.log('Não existe nenhuma conta com esse email');
            return res.status(400).send({'msg': 'Não existe nenhuma conta com esse email'});
        }

        await bcrypt.genSalt(10, async (err, salt) => {
            if (err) return next(err);
    
            await bcrypt.hash(Date.now()+'', salt, async (err, hash) => {
                if (err) return console.log(err);
    
                cliente.resetPasswordToken = hash;
                console.log('Token '+hash+' gerado para '+cliente.email);
                cliente.resetPasswordExpires = Date.now() + 1800000; // 30 minutos

                let newCliente = Cliente(cliente);

                await newCliente.save(async (err, cliente) => {
                    if (err) {
                        console.log(err);
                        return res.status(400).send({ 'msg': err });
                    }
        
                    console.log('salvando token para '+cliente.email);
                    var smtpTransport = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                            user: 'frozzateste@gmail.com',
                            pass: '#teste123'
                        }
                    });
                    
                    var mailOptions = {
                        to: cliente.email,
                        from: 'passwordreset@brazilianbet.com',
                        subject: 'Recuperação de senha',
                        text: 'Você está recebendo esse email porque você (ou talvez outra pessoa) solicitou recuperação de senha no site da Brazilian Bet.\n\n' +
                        'Por favor clique no link abaixo ou copie e cole no navegador:\n\n' +
                        'http://localhost:3000/auth/passwordRecover/' + cliente.resetPasswordToken + '\n\n' +
                        'Se você não requisitou isso, por favor ignore este email.\n'
                    };
            
                    await smtpTransport.sendMail(mailOptions).then((p) => {
                        if(p.response.substr(0,3) != '250'){
                            console.log(err);
                            return res.status(400).json({'msg': 'Falha ao enviar email'});
                        }else{
                            console.log("enviando email");
                            return res.status(201).json({'msg': 'Um email foi enviado para ' + cliente.email + ' com as instruções de recuperação!'});
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

    Cliente.findOne({ resetPasswordToken: req.body.token,  resetPasswordExpires: { $gt: Date.now() } }, (err, cliente) => {
        if (err) {
            return res.status(400).send({ 'msg': err });
        }
 
        if (!cliente) {
            return res.status(400).json({ 'msg': 'Esse token é inválido ou já expirou' });
        }
 
        return res.status(200).send({'msg': 'Token válido', "cliente": cliente.apelido});
    });
};

exports.resetForgotPassword = async (req, res) => {
    if(!req.body.token && !req.body.senha){
        return res.status(400).json({'msg': 'Você precisa de um token e uma senha para redefinir'});
    }

    Cliente.findOne({ resetPasswordToken: req.body.token,  resetPasswordExpires: { $gt: Date.now() } }, (err, cliente) => {
        if (err) {
            return res.status(400).send({ 'msg': err });
        }
 
        if (!cliente) {
            return res.status(400).json({ 'msg': 'Esse token é inválido ou já expirou' });
        }

        cliente.senha = req.body.senha;

        let newCliente = Cliente(cliente);
 
        newCliente.save((err, cliente) => {
            if (err) {
                return res.status(400).json({ 'msg': err });
                console.log(err);
            }

            delete cliente.senha;

            return res.status(201).json({
                
            });
        });        
    });
};