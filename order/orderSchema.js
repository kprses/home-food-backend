// Load required packages
var mongoose = require('mongoose');

// Define offer schema
var Order = new mongoose.Schema({
    dateTime: Date,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
     offer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Offer'
    }
});

// Export the Mongoose model
module.exports = mongoose.model('Order', Order);