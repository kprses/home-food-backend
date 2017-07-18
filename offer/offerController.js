// importing Offer model
var Offer = require('./offerSchema');
var Order = require('../order/orderSchema');
var multer = require('multer');
var path = require('path');
var fs = require('fs');

var rootFolder = path.dirname(require.main.filename);

exports.savePictures = function(req, res) {

    var offerPath = "/uploads/users/" + req.params.user_id + "/" + req.params.offer_id;

    Offer.update({ _id: req.params.offer_id }, {
            imagesFolder: offerPath
        },
        function(err, offer) {
            if (err) {
                res.status(400).send(err);
                return;
            }
            res.json(offer);
        });
}

exports.createOffer = function(req, res) {

    var offer = new Offer(req.body);
    offer.dateCreated = new Date();
    offer.status = "None";
    offer.active = true;
    offer.user = req.user._id; // WE ALWAYS HAVE OBJECT USER IN REQUEST BECAUSE OF PASSPORT LOGIC AND WE ALWAYS SET USER DATA ON SERVER
    // SO THAT CLIENT CANNOT MANIPULATE WITH IDENTITY
    //             ||
    //             ||
    //             \/
    //do not allow user to fake identity. The user who postet the offer must be the same user that is logged in
    // if (!req.user.equals(offer.user)) {
    //     res.sendStatus(401);
    // }
    offer.save(function(err, m) {
        if (err) {
            res.status(400).send(err);
            return;
        }
        res.status(201).json(m);
    });
};

// Endpoint /api/offers for GET
exports.getOffersForUser = function(req, res) {

    var loadedElementsNumber = parseInt(req.headers.loadedelements);

    /*    Offer.find(function(err, offers) {
            if (err) {
                res.status(400).send(err);
                return;
            }
            res.json(offers);
        });*/

    Offer.find({ $and: [{ "user": req.user._id }, { "active": true }] }, null, { sort: { dateCreated: -1 }, skip: loadedElementsNumber, limit: 15 }, function(err, offers) {
        if (err) {
            res.status(400).send(err);
            return;
        }
        res.json(offers);

    });
};

// Getting all offers for search
exports.getAllOffers = function(req, res) {
    //var loadedElementsNumber = parseInt(req.headers.loadedelements);

    Offer.find({ active: true }, function(err, offers) {
        if (err) {
            res.status(400).send(err);
            return;
        }
        res.json(offers);
    });


};

exports.getOffer = function(req, res) {
    // Use the Movie model to find a specific movie
    Offer.findById(req.params.offer_id, function(err, offer) {
        if (err) {
            res.status(400).send(err)
            return;
        };

        res.json(offer);
    });
};

// Create endpoint /api/offers/:offer_id for PUT
exports.putOffer = function(req, res) {
    // Use the Offer model to find a specific offer and update it
    Offer.findByIdAndUpdate(
        req.params.offer_id,
        req.body, {
            //pass the new object to cb function
            new: true,
            //run validations
            runValidators: true
        },
        function(err, offer) {
            if (err) {
                res.status(400).send(err);
                return;
            }
            res.json(offer);
        });
};

// Create endpoint /api/offers/:offer_id for DELETE
exports.deleteOffer = function(req, res) {

    Order.update({ "offer": req.params._id }, { status: 'Canceled' }, { multi: true }, function(err, orders) {
        if (err) {
            res.status(400).send(err);
            return;
        }
    })

    // Use the Beer model to find a specific beer and remove it
    Offer.findByIdAndUpdate(req.params.offer_id, { active: false, status: "Deleted" }, function(err, m) {
        if (err) {
            res.status(400).send(err);
            return;
        }
        res.sendStatus(200);
    });
};

exports.getDisplayImageForOffer = function(req, res) {

    Offer.findById(req.params.offer_id, function(err, offer) {
        if (err) {
            res.status(400).send(err)
            return;
        }

        if (!offer.imagesFolder) {
            res.json("");
            return;
        }

        try {
            var files = fs.readdirSync(path.join(rootFolder, offer.imagesFolder));

            if (files != null) {
                var imgUrl = "http://localhost:3000" + offer.imagesFolder + "/" + files[0];
                res.json(imgUrl);
            }
        } catch (ex) {
            res.json("");
        }

    });
};

exports.changeStatusToConfirmed = function(req, res) {

    Offer.findById(req.params.offer_id, function(err, offer) {
        if (err) {
            res.status(400).send(err)
            return;
        };

        Order.findOne({ "offer": offer._id }, function(err, order) {
            if (err) {
                res.status(400).send(err);
                return;
            }

            if (order) {

                if (req.body.confirmationCode == order.randNum) {

                    offer.status = "Confirmed";
                    offer.active = false;

                    offer.save(function(err) {
                        if (!err) {
                            res.json(offer);
                        }

                    });
                } else {
                    res.status(400).send("Confirmation code is not valid!");
                }
            }
        })
    });
};