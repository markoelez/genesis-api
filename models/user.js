/**
 * Created by Marko on 5/4/17.
 */
 var mongoose = require('mongoose');
 var passportLocalMongoose = require('passport-local-mongoose');
 var Schema = mongoose.Schema;

 var User = new Schema({
   username: String,
   password: String,
   studentID: {type: Number}
 });

   User.plugin(passportLocalMongoose);
   module.exports = mongoose.model("User", User);
