
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const createError = require('http-errors');
const Router = require('./routes/router');
var session = require('express-session')
const { flash } = require('express-flash-message');
const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(
    session({
      secret: 'secret',
      resave: false,
      saveUninitialized: true,})
  );
 app.use(flash());
 app.use(Router);
//  app.get('/logout', (req, res) => {
//     req.flash('message', 'You are now logged out.');
//     res.redirect('/');
// });
// app.get('/', (req, res) => {
//     res.render('index', { message: req.flash('message') });
// });
// app.set("trust proxy", 1);

// app.use(( req, res, next)=>{
//   console.log("innnnnnnnnn")
//   next()
// })

// app.use(function(req, res, next) {

//   next(createError(404));
// });


module.exports = app;
