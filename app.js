
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const createError = require('http-errors');
const Router = require('./routes/router');
// const { flash } = require('express-flash-message');
var app = express();
const fileUpload  = require('express-fileupload');

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(flash());
app.use(
  fileUpload()
);
app.use(Router);




app.use(function(req, res, next) {
  next(createError(404));
});

module.exports = root_dir = __dirname+"/public/"
module.exports = app;
