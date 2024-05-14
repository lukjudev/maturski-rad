const mongoose = require('mongoose');

const apartmentSchema = new mongoose.Schema({
    title: String,
    description: String,
    country: String,
    address: String,
    rooms: Number,
    bathrooms: Number,
    capacity: Number,
    user: String,
    price: Number,
    images: {
        type: [String],
        default: undefined
    }
});

module.exports = mongoose.model("Apartment", apartmentSchema);