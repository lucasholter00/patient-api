require('dotenv').config()
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var appointmentsRouter = require('./routes/appointments');
var availableTimes = require('./routes/availableTimes')
var dentistsRouter = require('./routes/dentists')
var patientsRouter = require('./routes/patients')
var clinicsRouter = require('./routes/clinics')
var subscriberRouter = require('./routes/emailSubscriber')

var app = express();
const cors = require('cors');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/appointments', appointmentsRouter);
app.use('/availableTimes', availableTimes)
app.use('/dentists', dentistsRouter)
app.use('/patients', patientsRouter)
app.use('/clinics', clinicsRouter)
app.use('/subscriber', subscriberRouter)

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
