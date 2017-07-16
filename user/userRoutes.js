module.exports = userRoutes;

function userRoutes(passport) {

    var userController = require('./userController');
    var router = require('express').Router();


    router.post('/login', userController.login);
    router.post('/signup', userController.signup);
    router.get('/unregister', passport.authenticate('jwt', { session: false }), userController.unregister)
    router.get('/:user_id', userController.getUser);
    return router;

}