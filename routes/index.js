var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');
var request = require('request');
var cheerio = require('cheerio');

//register
router.post('/register', function(req, res){
    var username = req.body.username;
    var password = req.body.password;
    var studentID = req.body.studentID;

    areCredentialsValid(username, password, function (statusBoolean) {
        if (statusBoolean === true){
            User.register(new User({
                username: username,
                password: password,
                studentID: studentID
            }), password, function (){
                console.log('Registered:');
                res.redirect('./');
                res.end()
            })
        }else{
            console.log('Invalid Credentials:');
            res.redirect('./');
            res.end()
        }
    });
});

function areCredentialsValid(username, password, callback){
    if (typeof username !== 'undefined' && username !== null && username !== '' &&
        typeof password !== 'undefined' && password !== null && password !== ''){
        var cookie = {};
        var responseBoolean = false;
        var config = {
            method: 'GET',
            url: 'https://parents.mtsd.k12.nj.us/genesis/j_security_check',
            headers: {
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36'
            }
        };
        request(config, function (error, response, body) {
            cookie = response.headers['set-cookie'];
            console.log(cookie);
            var config = {
                method: 'POST',
                url: 'https://parents.mtsd.k12.nj.us/genesis/j_security_check',
                form: {
                    'j_username': username,
                    'j_password': password
                },
                headers: {
                    'Cookie': cookie,
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36'
                }
            };
            request(config, function (error, response2, body) {
                //console.log(response);
                console.log(response2.headers);
              if (response2.headers['location'] === '/genesis/parents?gohome=true'){
                  responseBoolean = true;
              }else{
                  responseBoolean = false;
              }
              callback(responseBoolean);
              return responseBoolean;
            })
        })
    }
}

//login
router.post('/login', function(req, res) {


    passport.authenticate('local', function (error, user, info){
        if (user === false) {
            // handle login error ...
        } else {
            // handle successful login ...
        }
    });
});

module.exports = router;
