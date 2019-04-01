var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const Errors = require('./errors');

var indexRouter = require('./routes/index');

require('./services/mongoose_service');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'm')));
app.use(express.static(path.join(__dirname, 'd')));

app.use('/m', express.static(path.join(__dirname, 'm')));
app.use('/d/*', express.static(path.join(__dirname, 'd')));

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use('*', function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  // res.locals.message = err.message;
  // res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  if(err instanceof Errors.BaseHTTPError) {
    res.statusCode = err.httpCode;
    res.header('Access-Control-Allow-Origin', ['*']);
    res.json({
      code: err.OPCode,
      msg: err.httpMsg,
    })
  }else if(err.statusCode === 404) {
    if(err.statusCode === 404) res.render('error', {title: '走丢了～？', message: '找不到页面～', error: err});
  }else {
    res.header('Access-Control-Allow-Origin', ['*']);
    res.json({
      code: Errors.BaseHTTPError.DEFAULT_OPCODE ,
      msg: '服务器好像出错了，一会儿再试试吧~',
    })
  }
  // res.status(err.status || 500);
  // res.render('error');
});

module.exports = app;
