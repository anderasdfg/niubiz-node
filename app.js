const config = require('config');

var express = require('express');
const session = require('express-session');

var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var niubizRouter = require('./routes/niubiz-routes');


var app = express();

app.use(logger(config.get('logger')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



app.use('/', indexRouter);
app.use('/niubiz', niubizRouter);

module.exports = app;
