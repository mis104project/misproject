var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var flash = require('connect-flash');
var io = require('socket.io');
var eventproxy = require('eventproxy');
var ep = new eventproxy();

//導入 session 外部插件
var session = require('express-session');
var RedisStore = require('connect-redis')(session);

var TaskModel = require('./models/task');
var MemberModel = require('./models/member');
var moment = require('moment');
var now = moment().format();

var $ = require('jquery');


//導入busboy以處裡上傳檔案
var busboy = require('connect-busboy');

var webRouter = require('./routes/web_routers');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//建立session

var redisHost = 'redis-17993.c1.ap-southeast-1-1.ec2.cloud.redislabs.com';
var redisPort = 17993;

var sessionMiddleware = session({
    secret: 'asasasas',
    store: new RedisStore({

        port: redisPort,
        host: redisHost,
        name:"i-Sharing",
        password:"ezOIjDRc4lsSrS0JkAfjzNxwkCZiQMiH"
        //port: 6379,
        //host: '127.0.0.1'
    }),
    resave: true,
    saveUninitialized: true
});
app.use(sessionMiddleware);

//檢查並處裡過期任務

app.use(function (req, res, next) {
    TaskModel.findMin({status: 'available'}, {due_date: 1}, function (err, result) {
        if (result) {

            if (moment(result.due_date).isBefore(now)) {
                var update = {$inc: {asset: result.reward}};

                MemberModel.updateMember({_id: result.pmID}, update, function (err, member) {

                    if (member) {

                        TaskModel.removeTask({_id: result._id}, function (err, success) {
                            if (success) {
                                ep.emit('success', '刪除任務成功！');
                            } else {
                                ep.emit('info_error', 'error');
                            }
                        });
                    }
                });
            }
        }
    });
    next();
});

app.use(function (req, res, next) {
    app.locals.current_member = req.session.member;
    app.locals.current_requests = req.session.requests;
    next();
});
app.use(flash());

app.use(function (req, res, next) {
    app.locals.user = req.session.user;
    var suc = req.flash('success');
    res.locals.r_success = suc.length ? suc : null;

    var err = req.flash('error');
    res.locals.r_error = err.length ? err : null;

    var s_err = req.flash('s_error');
    res.locals.s_error = s_err.length ? s_err : null;


    next();
});


app.use('/', webRouter);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
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

exports.express = app;
exports.sessionMiddleware = sessionMiddleware;