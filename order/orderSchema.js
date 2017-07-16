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
    },
    randNum: String,
    status: String,
    paymentOption: String,
    price: Number,
    cardName: String,
    credtCardNumber: String,
    expiringMonth: String,
    expiringYear: String
});

// Export the Mongoose model
module.exports = mongoose.model('Order', Order);