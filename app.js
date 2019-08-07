//Start our server project
//npm init -y
//npm install express body-parser jsonwebtoken passport passport-jwt mongoose bcrypt cors

global.config = require('./config/config');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var restful = require('node-restful');
var methodOverride = require('method-override');
var cors = require('cors');
var passport = require('passport');
var nodemailer = require('nodemailer');

var index = require('./routes/index');
var cliente = require('./routes/cliente');
var produto = require('./routes/produto');
var pagseguro = require('./routes/pagseguro');
var pagarme = require('./routes/pagarme');

var app = express();

global.appRoot = require('app-root-path');
global.pagarmeAPI = require('pagarme');

mongoose.Promise = global.Promise;

mongoose.connect(config.db)
  .then(() =>  console.log('connection successful'))
  .catch((err) => console.error(err));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Use the passport package in our application
app.use(passport.initialize());
var passportMiddleware = require('./middleware/passport');
passport.use(passportMiddleware);

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(bodyParser.json({type:'application/vnd.api+json'}));
app.use(methodOverride());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors());
app.use('/', index);
app.use('/api/v1/cliente', cliente);
app.use('/api/v1/produto', produto);
app.use('/api/v1/pagseguro', pagseguro);
app.use('/api/v1/pagarme', pagarme);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json(err.message);
});

module.exports = app;
