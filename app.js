var createError = require('http-errors');
var express = require('express');
var exphbs = require('express-handlebars');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session');
const fileUpload = require('express-fileupload');
const i18n = require('i18n');
var moment = require('moment-timezone');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var loginRouter = require('./routes/login');
var productsRouter = require('./routes/products');
const { cookie } = require('express-validator');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({
  extname: '.hbs',
  defaultLayout: 'main',
  helpers: {
    __: function() { return i18n.__.apply(this, arguments); },
    __n: function() { return i18n.__n.apply(this, arguments); }
  }
}));
app.set('view engine', '.hbs');

i18n.configure({
  locales: ['en', 'no'],
  fallbacks: {'en': 'no'},
  defaultLocale: 'en',
  cookie: 'locale',
  queryParameter: 'lang',
  directory: __dirname + '/locales',
  directoryPermissions: '755',
  autoReload: true,
  updateFiles: true
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
moment.tz.setDefault("Europe/Oslo");
app.use(i18n.init);

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('upload'));
app.use(fileUpload());



app.use(session({
  key: "user_sid",
  secret: 'hello',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 900000}
}));


app.use((req, res, next) => {
  if (req.cookies.user_sid && !req.session.user) {
    res.clearCookie("user_sid");
  }
  next();
});

app.get('/home', indexRouter);

app.get('/nl', function (req, res) {
  res.cookie('locale', 'no', { maxAge: 900000, httpOnly: true });
  res.redirect('/');
});
app.get('/en', function (req, res) {
  res.cookie('locale', 'en', { maxAge: 900000 , httpOnly: true });
  res.redirect('/');
});

if(cookie){
  moment.tz.setDefault("cookie value");
}
else{
 moment.tz.setDefault("Asia/kolkata")
}

app.use('/', loginRouter);
app.use('/users', usersRouter);
app.use('/products',productsRouter);
app.use(function (req, res, next) {
  res.status(404).send("Sorry can't find that!");
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
