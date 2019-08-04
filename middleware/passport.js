var Cliente        = require('../models/Cliente');
var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt  = require('passport-jwt').ExtractJwt;
 
var opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.jwtSecret
}
 
module.exports = new JwtStrategy(opts, function (jwt_payload, done) {
    Cliente.findById(jwt_payload.id, function (err, cliente) {
        if (err) {
            return done(err, false);
        }
        if (cliente) {
            return done(null, cliente);
        } else {
            return done(null, false);
        }
    });
});