var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
const mysql = require("mysql");

var adminRouter = require('./routes/admin/admin');
var usersAdminRouter = require('./routes/admin/users');
var labAdminsAdminRouter = require('./routes/admin/labAdmins');
var testsAdminRouter = require('./routes/admin/tests');


var labAdminRouter = require('./routes/labAdmin/labAdmin');
var testsLabAdminRouter = require('./routes/labAdmin/tests');
var userLabAdminRouter = require('./routes/labAdmin/user');
var chatLabAdminRouter = require('./routes/labAdmin/chat');

var userRouter = require('./routes/user/user');
var testsUserRouter = require('./routes/user/tests');
var labAdminUserRouter = require('./routes/user/labAdmin');
var chatUserRouter = require('./routes/user/chat');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/admin', adminRouter);
app.use('/admin/users', usersAdminRouter);
app.use('/admin/lab-admins', labAdminsAdminRouter);
app.use('/admin/tests', testsAdminRouter);

app.use('/lab-admin', labAdminRouter);
app.use('/lab-admin/tests', testsLabAdminRouter);
app.use('/lab-admin/users/profile/', userLabAdminRouter);
app.use('/lab-admin/chat/', chatLabAdminRouter);


app.use('/user', userRouter);
app.use('/user/tests', testsUserRouter);
app.use('/user/lab-admin/profile/', labAdminUserRouter);
app.use('/user/chat/', chatUserRouter);



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
