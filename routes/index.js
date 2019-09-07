var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Noxus API' });
});

router.get('/webhook', function(res, res, nex){
  var shell = require('shelljs');
  require('shelljs/global');
  global.verbose = true;
  shell.cd(appRoot.path);
  var result = "node - "+shell.exec('git pull');
  shell.exec('npm install');
  shell.cd('../../react/brazilian-bet');
  result += " | react - "+shell.exec('git pull');
  result += " - " + shell.exec('npm run build');
  shell.cd('../..');
  result += " - " + shell.exec('cp .htaccess react/brazilian-bet/build/.htaccess');
  result += " | "+appRoot.path;
  res.json({result: result});
});

router.post('/webhook', function(res, res, nex){
  var shell = require('shelljs');
  require('shelljs/global');
  global.verbose = true;
  shell.cd(appRoot.path);
  var result = "node - "+shell.exec('git pull');
  shell.exec('npm install');
  shell.cd('../../react/brazilian-bet');
  result += " | react - "+shell.exec('git pull');
  result += " - " + shell.exec('npm run build');
  shell.cd('../..');
  result += " - " + shell.exec('cp .htaccess react/brazilian-bet/build/.htaccess');
  result += " | "+appRoot.path;
  res.json({result: result});
});

module.exports = router;
