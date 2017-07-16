module.exports = orderRoutes;


function orderRoutes(passport) {

    var orderController = require('./orderController');
    var router = require('express').Router();
    var unless = require('express-unless');

    var mw = passport.authenticate('jwt', { session: false });
    mw.unless = unless;

    //middleware
    router.use(mw.unless({ method: ['OPTIONS'] }));

    router.route('/')
        .post(orderController.createOrder)
        .get(orderController.getOrders);

    //         router.route('/')
    //     .post(offerController.createOffer)
    //     .get(movieController.getMovies);

    router.route('/:order_id')
         .get(orderController.getOrder)
         .put(orderController.putOrder)
         .delete(orderController.deleteOrder);


    return router;
}