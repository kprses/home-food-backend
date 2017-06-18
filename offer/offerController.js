// importing Movie model
var Offer = require('./offerSchema');
exports.createOffer = function(req, res) {
    var offer = new Offer(req.body);
    //do not allow user to fake identity. The user who postet the movie must be the same user that is logged in
    // if (!req.user.equals(offer.user)) {
    //     console.log("DOSO");
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

// TO DO:
//GET ALL, GET BY ID, UPDATE, AND DELETE 
// ANALOGOUS TO THE MOVIE APP CRUD