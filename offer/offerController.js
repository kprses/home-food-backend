// importing Offer model
var Offer = require('./offerSchema');
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
    offer.user = req.user._id; // WE ALWAYS HAVE OBJECT USER IN REQUEST BECAUSE OF PASSPORT LOGIC AND WE ALWAYS SET USER DATA ON SERVER
    // SO THAT CLIENT CANNOT MANIPULATE WITH IDENTITY
    //             ||
    //             ||
    //             \/
    //do not allow user to fake identity. The user who postet the movie must be the same user that is logged in
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
exports.getOffers = function(req, res) {

    var loadedElementsNumber = parseInt(req.headers.loadedelements);

    /*    Offer.find(function(err, offers) {
            if (err) {
                res.status(400).send(err);
                return;
            }
            res.json(offers);
        });*/

    Offer.find({ "user": req.user._id }, null, { sort: { dateCreated: -1 }, skip: loadedElementsNumber, limit: 15 }, function(err, offers) {
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
    // Use the Beer model to find a specific beer and remove it
    Offer.findById(req.params.offer_id, function(err, m) {
        if (err) {
            res.status(400).send(err);
            return;
        }
        m.remove();
        res.sendStatus(200);
    });
};

exports.getDisplayImageForOffer = function(req, res) {

    /*Offer.findById(req.params.offer_id, function(err, offer) {
        if (err) {
            res.status(400).send(err)
            return;
        };

        var files = fs.readdirSync(offer.imagesFolder);
        if (files != null)
            res.sendFile(files[0], { root: offer.imagesFolder });
    });*/

    Offer.findById(req.params.offer_id, function(err, offer) {
        if (err) {
            res.status(400).send(err)
            return;
        };

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


}