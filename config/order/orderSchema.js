// Load required packages
var mongoose = require('mongoose');

var Order   = new mongoose.Schema({
    offerId: String,
    dateTime: Date,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

// Export the Mongoose model
module.exports = mongoose.model('Offer', Offer);