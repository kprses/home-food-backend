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
        .post(offerController.createOffer)
        .get(offerController.getOffers);

    //         router.route('/')
    //     .post(offerController.createOffer)
    //     .get(movieController.getMovies);

    router.route('/:offer_id')
         .get(offerController.getOffer)
         .put(offerController.putOffer)
         .delete(offerController.deleteOffer);

    return router;
}