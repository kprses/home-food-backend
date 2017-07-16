// importing Movie model
var Feedback = require('./feedbackSchema');
exports.createFeedback = function(req, res) {
    var feedback = new Feedback(req.body);
    //do not allow user to fake identity. The user who postet the movie must be the same user that is logged in
    // if (!req.user.equals(offer.user)) {
    //     console.log("DOSO");
    //     res.sendStatus(401);
    // }
    feedback.save(function(err, m) {
        if (err) {
            res.status(400).send(err);
            return;
        }
        res.status(201).json(m);
    });
};

// Create endpoint /api/feedbacks for GET
exports.getFeedbacks = function(req, res) {
    Feedback.find(function(err, feedbacks) {
        if (err) {
            res.status(400).send(err);
            return;
        }
        res.json(feedbacks);
    });
};

exports.getFeedback = function(req, res) {
    // Use the Movie model to find a specific movie
    Feedback.findById(req.params.feedback_id, function(err, feedback) {
        if (err) {
            res.status(400).send(err)
            return;
        };

        res.json(feedback);
    });
};


exports.getFeedbackByUser = function(req, res) {
    var a = {"user": req.params.user};
    Feedback.find(a, function(err, feedbacks){
        if (err) {
            res.status(400).send(err)
            return;
        };
        
        res.json(feedbacks);
    });

    /*    Offer.find(function(err, offers) {
            if (err) {
                res.status(400).send(err);
                return;
            }
            res.json(offers);
        });*/

};








// Create endpoint /api/feedbacks/:feedback_id for PUT
exports.putFeedback = function(req, res) {
    // Use the Offer model to find a specific offer and update it
    Feedback.findByIdAndUpdate(
        req.params.feedback_id,
        req.body,
        {
            //pass the new object to cb function
            new: true,
            //run validations
            runValidators: true
        }, function (err, feedback) {
        if (err) {
            res.status(400).send(err);
            return;
        }
        res.json(feedback);
    });
};

// Create endpoint /api/feedbacks/:feedback_id for DELETE
exports.deleteFeedback= function(req, res) {
    // Use the Beer model to find a specific beer and remove it
    Feedback.findById(req.params.feedback_id, function(err, m) {
        if (err) {
            res.status(400).send(err);
            return;
        }
        m.remove();
        res.sendStatus(200);
    });
};
