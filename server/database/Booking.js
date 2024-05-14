const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    user: String,
    apartment: String,
    checkIn: Date,
    checkOut: Date
});

module.exports = mongoose.model("Booking", bookingSchema);