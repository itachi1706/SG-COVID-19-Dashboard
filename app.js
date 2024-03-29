const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const sass = require('./sass-middleware');
const shrinkRay = require('shrink-ray-without-zopfli');
const favicon = require('serve-favicon');
const enforceSSL = require('express-sslify');
const helmet = require('helmet');

const indexRouter = require('./routes/index');
const adminRouter = require('./routes/admin');
const graphRouter = require('./routes/graph');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// HTTPS
console.log(app.get("env"));
if (app.get("env") !== "development") {
  if (!process.env.disableHTTPSRedirect) app.use(enforceSSL.HTTPS({trustProtoHeader: true})); // Enforce HTTPS if production and behind proxies like on Heroku
  app.use(helmet({crossOriginEmbedderPolicy: false}));
} else app.use(helmet({hsts: false})); // Disable HSTS in development

// CSP to whitelist domains to load. Must update this if we add new CDNs and stuff
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    imgSrc: ["'self'", "data:"],
    styleSrc: ["'self'", "'unsafe-inline'", 'fonts.googleapis.com', 'unpkg.com', 'cdn.datatables.net', 'www.gstatic.com'],
    scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", 'kit.fontawesome.com', 'kit-pro.fontawesome.com', 'code.jquery.com', 'www.gstatic.com',
      'unpkg.com', 'cdn.datatables.net', 'cdnjs.cloudflare.com', 'www.google-analytics.com', 'static.cloudflareinsights.com'],
    fontSrc: ["'self'", 'fonts.gstatic.com'],
    connectSrc: ["'self'", 'www.googleapis.com', 'kit-pro.fontawesome.com', 'securetoken.googleapis.com', 'ka-p.fontawesome.com']
  }
}));
app.use(helmet.referrerPolicy({policy: 'same-origin'}));

// set up rate limiter: maximum of 20 requests per 10 second
var rateLimit = require('express-rate-limit');
var limiter = rateLimit({
  windowMs: 10*1000, // 10 seconds
  max: 20
});
app.use(limiter);

app.use(logger('dev'));
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(shrinkRay({brotli:{quality:6},filter:shrinkRay.filter})); // See Alorel/shrink-ray#52 for reason why we need filter
app.use('/stylesheets', sass);
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/admin', adminRouter);
app.use('/graph', graphRouter);

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
