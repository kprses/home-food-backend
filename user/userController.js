var Config = require('../config/config.js');
var User = require('./userSchema');
//var jwt = require('jwt-simple');
var jwt = require('jsonwebtoken');

module.exports.login = function(req, res) {

    if (!req.body.username) {
        res.status(400).send('username required');
        return;
    }
    if (!req.body.password) {
        res.status(400).send('password required');
        return;
    }

    User.findOne({ username: req.body.username }, function(err, user) {
        if (err) {
            res.status(500).send(err);
            return
        }

        if (!user) {
            res.status(401).send('Invalid Credentials');
            return;
        }
        user.comparePassword(req.body.password, function(err, isMatch) {
            if (!isMatch || err) {
                res.status(401).send('Invalid Credentials');
            } else {
                res.status(200).json({ token: createToken(user), userId: user._id });
            }
        });
    });

};

module.exports.signup = function(req, res) {
    if (!req.body.username) {
        res.status(400).send('username required');
        return;
    }
    if (!req.body.password) {
        res.status(400).send('password required');
        return;
    }

    var user = new User();

    user.username = req.body.username;
    user.password = req.body.password;

    user.save(function(err) {
        if (err) {
            res.status(500).send(err);
            return;
        }

        res.status(201).json({ token: createToken(user) });
    });
};

module.exports.unregister = function(req, res) {
    req.user.remove().then(function(user) {
        res.sendStatus(200);
    }, function(err) {
        res.status(500).send(err);
    });
};

module.exports.getUser = function(req, res) {
    // Use the Movie model to find a specific movie
    User.findById(req.params.user_id, function(err, user) {
        if (err) {
            res.status(400).send(err)
            return;
        };

        res.json(user);
    });
};

function createToken(user) {
    var tokenPayload = {
        user: {
            _id: user._id,
            username: user.username
        }

    };
    return "JWT " + jwt.sign(user, Config.auth.jwtSecret, {
        expiresIn: 604800
    });
    //return "JWT " + jwt.encode(tokenPayload, Config.auth.jwtSecret);
};