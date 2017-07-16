// Load required packages
var mongoose = require('mongoose');

// Define offer schema
var Offer = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required field.']
    },
    imageFolder: String,
    price: Number,
    ingredients: String,
    deliveryType: String,
    handoutDatetimeStart: { type: Date, default: null },
    handoutDatetimeEnd: { type: Date, default: null },
    description: String,
    vegan: { type: Boolean, default: false },
    vegetarian: { type: Boolean, default: false },
    halal: { type: Boolean, default: false },
    bio: { type: Boolean, default: false },
    imagesFolder: { type: String, default: null },
    dateCreated: Date,
    place: String,
    status: String,
    active: Boolean,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

// Export the Mongoose model
module.exports = mongoose.model('Offer', Offer);