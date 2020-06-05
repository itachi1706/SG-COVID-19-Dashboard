const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const sassMiddleware = require('node-sass-middleware');
const compression = require('compression');
const favicon = require('serve-favicon');
const enforceSSL = require('express-sslify');
const helmet = require('helmet');

const indexRouter = require('./routes/index');
const adminRouter = require('./routes/admin');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// HTTPS
console.log(app.get("env"));
if (app.get("env") !== "development") {
  if (!process.env.disableHTTPSRedirect) app.use(enforceSSL.HTTPS({trustProtoHeader: true})); // Enforce HTTPS if production and behind proxies like on Heroku
  app.use(helmet());
} else app.use(helmet({hsts: false})); // Disable HSTS in development

// CSP to whitelist domains to load. Must update this if we add new CDNs and stuff
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    styleSrc: ["'self'", "'unsafe-inline'", 'fonts.googleapis.com', 'unpkg.com', 'cdn.datatables.net', 'www.gstatic.com'],
    scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", 'kit.fontawesome.com', 'kit-pro.fontawesome.com', 'code.jquery.com', 'www.gstatic.com', 'unpkg.com', 'cdn.datatables.net', 'cdnjs.cloudflare.com', 'www.google-analytics.com'],
    fontSrc: ["'self'", 'fonts.gstatic.com'],
    connectSrc: ["'self'", 'www.googleapis.com', 'kit-pro.fontawesome.com', 'securetoken.googleapis.com']
  }
}));
app.use(helmet.referrerPolicy({policy: 'same-origin'}));

app.use(logger('dev'));
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(compression());
app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true, // true = .sass and false = .scss
  sourceMap: true
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/admin', adminRouter);

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
  res.render('error', { message: err.message, errstatus: err.status, errstack: err.stack });
});

module.exports = app;
