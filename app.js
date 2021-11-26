const createError = require('http-errors');
const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const fileUpload = require('express-fileupload');
const i18n = require('i18n');
const {body, validationResult} = require('express-validator');
const moment = require('moment-timezone');
const jwt = require('jsonwebtoken');
const csrf = require('csurf');
const csrfprotect = csrf({cookie: true});
const nodemailer = require('nodemailer');


const uapiRouter = require('./routes/api/user.routes');
const papiRouter = require('./routes/api/product.routes');
const capiRouter = require('./routes/api/category.routes');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const loginRouter = require('./routes/login');
const productsRouter = require('./routes/products');
const categoryRouter = require('./routes/category');

const {cookie} = require('express-validator');
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({
  extname: '.hbs',
  layoutsDir: __dirname + '/views/layouts/',
  helpers: {
    __: function () {
      return i18n.__.apply(this, arguments);
    },
    __n: function () {
      return i18n.__n.apply(this, arguments);
    }
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
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
console.log('sets timezone to Europe/Oslo and locale to en');
app.use(i18n.init);
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('upload'));
app.use(fileUpload());


app.use(session({
  key: "user_sid",
  secret: 'hello',
  resave: false,
  saveUninitialized: true,
  cookie: {maxAge: 900000}
}));

// app.use((req, res, next) => {
//   if (req.cookies.user_sid && !req.session.user) {
//     res.clearCookie("user_sid");
//   }
//   next();
// });

app.get('/home', indexRouter);

app.get('/nl', function (req, res) {
  res.cookie('locale', 'no', moment.tz.setDefault("Europe/Oslo"), {maxAge: 900000, httpOnly: true});
  res.redirect('back');
});

app.get('/en', function (req, res) {
  res.cookie('locale', 'en', {maxAge: 900000, httpOnly: true},
    moment.tz.setDefault("Asia/Kolkata"));
  res.redirect('back');
});

app.get('/api', (req, res) => {
  res.json({
    success: 1,
    message: "This is rest apis working"
  });
});

app.use(function (req, res, next) {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});

app.use('/api/products', papiRouter);
app.use('/api/users', uapiRouter);
app.use('/api/category', capiRouter);
app.use('/', loginRouter);
app.use('/users', usersRouter);
app.use('/products', productsRouter);
app.use('/category', categoryRouter);
app.use(function (req, res, next) {
  res.status(404).send("Sorry can't find that!");
});


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});


// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
