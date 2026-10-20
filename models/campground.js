const mongoose = require('mongoose')

const campgroundSchema = mongoose.Schema({
    name: String,
    price: String,
    description: String,
    location: String
})

module.exports = mongoose.model('Campground',campgroundSchema);