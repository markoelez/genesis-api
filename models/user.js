/**
 * Created by Marko on 5/4/17.
 */
 var mongoose = require('mongoose');
 var passportLocalMongoose = require('passport-local-mongoose');
 var Schema = mongoose.Schema;
 var bcrypt = require('bcrypt-nodejs');

 var User = new Schema({
   username: String,
   password: String,
   studentID: {type: Number}
 });

 User.methods.checkLogin = function (password, callback) {
     bcrypt.compare(password, this.password, function (error, same) {
         if (error){
             callback(error);
         }
         callback(same);
     })
 };

   User.plugin(passportLocalMongoose);
   module.exports = mongoose.model('User', User);
