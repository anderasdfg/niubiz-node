var express = require('express');
var router = express.Router();


/* GET users listing. */
router.get('/', function(req, res, next) {
  console.log('Ingresando a Niubiz-routes, sin embargo, seguiremos en index.js');
  res.send('respond with a resource');
});


module.exports = router;
