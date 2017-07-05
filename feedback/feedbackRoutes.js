module.exports = feedbackRoutes;


function feedbackRoutes(passport) {

    var feedbackController = require('./feedbackController');
    var router = require('express').Router();
    var unless = require('express-unless');

    var mw = passport.authenticate('jwt', { session: false });
    mw.unless = unless;

    //middleware
    router.use(mw.unless({ method: ['OPTIONS'] }));

    router.route('/')
        .post(feedbackController.createFeedback)
        .get(feedbackController.getFeedbacks);

    //         router.route('/')
    //     .post(offerController.createOffer)
    //     .get(movieController.getMovies);

    router.route('/:feedback_id')
         .get(feedbackController.getFeedback)
         .put(feedbackController.putFeedback)
         .delete(feedbackController.deleteFeedback);

    return router;
}