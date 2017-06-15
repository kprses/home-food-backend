var Config = require('./config/config.js');
var passport = require('passport');
/**
 * db connect
 */
var mongoose = require('mongoose');
mongoose.connect([Config.db.host, '/', Config.db.name].join(''), {
    //eventually it's a good idea to make this secure
    user: Config.db.user,
    pass: Config.db.pass
}, function(err, data) {
    if (!err)
        console.log("Connected to DB");
});
/**
 * create application
 */
var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');

var app = express();
/**
 * app setup
 */
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

//passport
app.use(passport.initialize());
app.use(passport.session());

var jwtConfig = require('./passport/jwtConfig');
jwtConfig(passport);

//require('./passport/jwtConfig')(passport);
/**
 * routing
 */
var userRoutes = require("./user/userRoutes");
var movieRoutes = require("./movie/movieRoutes");
var offerRoutes = require("./offer/offerRoutes");
app.use('/api/movies', movieRoutes(passport));
app.use('/api/user', userRoutes(passport));
app.use('/api/offer', offerRoutes(passport));

module.exports = app;