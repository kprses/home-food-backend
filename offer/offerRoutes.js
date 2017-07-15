module.exports = offerRoutes;

var Config = require('../config/config');

var multer = require('multer');
var storage = require('./storage.js')("./uploads");
var upload = multer({ storage: storage });

function offerRoutes(passport) {

    var offerController = require('./offerController');
    var router = require('express').Router();
    var unless = require('express-unless');

    var mw = passport.authenticate('jwt', { session: false });
    mw.unless = unless;

    //middleware
    router.use(mw.unless({
        method: ['OPTIONS'],
        custom: function(req) {
            if (req.originalUrl.includes('/api/offer/pictures') && req.method == 'GET') {
                return true;
            } else
                return false;
        }

    }));

    router.route('/')
        .get(offerController.getOffers)
        .post(offerController.createOffer);

    router.route('/pictures/:user_id/:offer_id')
        .post(upload.any(), offerController.savePictures);

    router.route('/pictures/:offer_id')
        .get(offerController.getDisplayImageForOffer);

    router.route('/confirm/:offer_id')
        .put(offerController.changeStatusToConfirmed);

    router.route('/:offer_id')
        .get(offerController.getOffer)
        .put(offerController.putOffer)
        .delete(offerController.deleteOffer);

    return router;
}