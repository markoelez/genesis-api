var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var User = require('./models/user');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var index = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//mongoose setup
//var mongooseURL = process.env.mongoURL; (testing purposes only!)
var mongooseURL = 'mongodb://scyon:genesis-api@ds127101.mlab.com:27101/genesis-api';
mongoose.connect(mongooseURL);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Connected to database:');
});

//passport setup
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(function (username, password, done) {
    User.findOne({username: username}, function (err, user) {
        user.checkLogin(password, function (error, userIsValid) {
            if (error) {
                console.log('Error:');
                return done(error, null);
            }
            if (userIsValid) {
                console.log('User is valid:');
                return done(null, user);
            }else{
                console.log('User is invalid:');
                return done (null, null, 'Invalid credentials');
            }
        });
    });
}));

// Creates the data necessary to store in the session cookie
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

// Reads the session cookie to determine the user from a user ID
    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });

    app.use(logger('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(cookieParser());
    app.use(express.static(path.join(__dirname, 'public')));

    app.use('/', index);

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

module.exports = app;
