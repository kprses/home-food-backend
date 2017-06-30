// Load required packages
var mongoose = require('mongoose');

// Define offer schema
var Offer = new mongoose.Schema({
    title: String,
    imageFolder: String,
    price: Number,
    ingredients: String,
    deliveryType: String,
    handoutDatetimeStart: Date,
    handoutDatetimeEnd: Date,
    description: String,
    vegan: Boolean,
    vegetarian: Boolean,
    halal: Boolean,
    bio: Boolean,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

// Export the Mongoose model
module.exports = mongoose.model('Offer', Offer);