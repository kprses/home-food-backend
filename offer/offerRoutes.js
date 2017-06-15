module.exports = offerRoutes;


function offerRoutes(passport) {

    var offerController = require('./offerController');
    var router = require('express').Router();
    var unless = require('express-unless');

    var mw = passport.authenticate('jwt', { session: false });
    mw.unless = unless;

    //middleware
    router.use(mw.unless({ method: ['OPTIONS'] }));

    router.route('/')
        .post(offerController.createOffer);

    //         router.route('/')
    //     .post(offerController.createOffer)
    //     .get(movieController.getMovies);

    // router.route('/:movie_id')
    //     .get(movieController.getMovie)
    //     .put(movieController.putMovie)
    //     .delete(movieController.deleteMovie);

    return router;
}