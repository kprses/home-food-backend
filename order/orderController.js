// importing Movie model
var Order = require('./orderSchema');
var Offer = require('../offer/offerSchema');

exports.getConfirmationCodeForSeller = function(req, res) {

    Order.findOne({ "offer": req.params.offer_id }, function(err, order) {
        if (err) {
            res.status(400).send(err)
            return;
        }

        var sellersCodePart = order.randNum.substr(0, 5) + ".....";

        res.json({ sellersCodePart });
    });
};

exports.createOrder = function(req, res) {
    var order = new Order(req.body);
    order.randNum = generateRandom();
    order.dateTime = new Date();
    order.status = "Initial";

    order.user = req.user._id;

    order.save(function(err, newOrder) {
        if (err) {
            res.status(400).send(err);
            return;
        }

        Offer.findByIdAndUpdate(req.body.offer, { status: "Ordered" }, function(err, updatedOffer) {
            if (err) {
                res.status(400).send(err);
                return;
            }
        });

        var orderJson = newOrder.toObject();
        orderJson.randNum = "....." + newOrder.randNum.substr(4, 5);

        res.status(201).send(orderJson);
    });
};

// Create endpoint /api/offers for GET
exports.getOrders = function(req, res) {
    Order.find(function(err, orders) {
        if (err) {
            res.status(400).send(err);
            return;
        }
        res.json(orders);
    });
};

exports.getOrder = function(req, res) {
    // Use the Movie model to find a specific movie
    Order.findById(req.params.order_id, function(err, order) {
        if (err) {
            res.status(400).send(err)
            return;
        };

        res.json(order);
    });
};

// Create endpoint /api/offers/:offer_id for PUT
exports.putOrder = function(req, res) {
    // Use the Offer model to find a specific offer and update it
    Order.findByIdAndUpdate(
        req.params.order_id,
        req.body, {
            //pass the new object to cb function
            new: true,
            //run validations
            runValidators: true
        },
        function(err, order) {
            if (err) {
                res.status(400).send(err);
                return;
            }
            res.json(order);
        });
};

// Create endpoint /api/offers/:offer_id for DELETE
exports.deleteOrder = function(req, res) {
    // Use the Beer model to find a specific beer and remove it
    Order.findById(req.params.order_id, function(err, m) {
        if (err) {
            res.status(400).send(err);
            return;
        }
        m.remove();
        res.sendStatus(200);
    });
};

generateRandom = function() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";


    for (var i = 0; i < 10; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}