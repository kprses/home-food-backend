// importing Movie model
var Order = require('./orderSchema');
exports.createOrder = function(req, res) {
    var order = new Order(req.body);
    //do not allow user to fake identity. The user who postet the movie must be the same user that is logged in
    // if (!req.user.equals(offer.user)) {
    //     console.log("DOSO");
    //     res.sendStatus(401);
    // }
    order.save(function(err, m) {
        if (err) {
            res.status(400).send(err);
            return;
        }
        res.status(201).json(m);
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
        req.body,
        {
            //pass the new object to cb function
            new: true,
            //run validations
            runValidators: true
        }, function (err, order) {
        if (err) {
            res.status(400).send(err);
            return;
        }
        res.json(order);
    });
};

// Create endpoint /api/offers/:offer_id for DELETE
exports.deleteOrder= function(req, res) {
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
