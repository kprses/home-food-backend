// Load required packages
var mongoose = require('mongoose');

// Define offer schema
var Feedback = new mongoose.Schema({
    comment: String,
    rating: Number ,
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
module.exports = mongoose.model('Feedback', Feedback);