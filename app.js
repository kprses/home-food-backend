var Config = require('./config/config.js');
var passport = require('passport');
/**
 * db connect
 */
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect([Config.db.host, '/', Config.db.name].join(''), {
    //eventually it's a good idea to make this secure
    user: Config.db.user,
    pass: Config.db.pass
}, function(err, db) {
    if (!err) {
        console.log("Connected to database:", Config.db.name);
    }

});
/**
 * create application
 */
var express = require('express');
var multer = require('multer');
var fs = require('fs');
var path = require('path');
var bodyParser = require('body-parser');
var cors = require('cors');

var app = express();

//var upload = multer({ dest: path.join(__dirname, DIR) });

/*var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, path.join(__dirname, DIR)); // Absolute path. Folder must exist, will not be created for you.
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname + '-' + Date.now());
    }
})

var upload = multer({ storage: storage });*/

/**
 * app setup
 */

///////////////////////// CORS SETTINGS //////////////////////////////

//app.use(cors());

////////////////////////   OR   /////////////////////////////////////

app.use(function(req, res, next) {


    //decoded = jwt.verify(authorization, secret.secretToken);

    res.setHeader("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:4200");
    res.setHeader("Access-Control-Allow-Headers", "Authorization, Origin, X-Requested-With, Content-Type, Accept, LoadedElements");
    res.setHeader("Access-Control-Allow-Credentials", true);
    next();
});

///////////////////////// END OF CORS SETTINGS //////////////////////////////

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

//passport
app.use(passport.initialize());
app.use(passport.session());

var jwtConfig = require('./passport/jwtConfig');
jwtConfig(passport);

/**
 * routing
 */
var userRoutes = require("./user/userRoutes");
var movieRoutes = require("./movie/movieRoutes");
var offerRoutes = require("./offer/offerRoutes");
var orderRoutes = require("./order/orderRoutes");
var feedbackRoutes = require("./feedback/feedbackRoutes");
app.use('/api/movies', movieRoutes(passport));
app.use('/api/user', userRoutes(passport));
app.use('/api/offer', offerRoutes(passport));
app.use('/api/order', orderRoutes(passport));
app.use('/api/feedback', feedbackRoutes(passport));

module.exports = app;