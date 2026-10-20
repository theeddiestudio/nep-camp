const mongoose = require('mongoose');
const { Campground } = require('../models');
const cities = require('./cities');
const { generateRandomNumbers , flattenList } = require('./functions');

mongoose.connect('mongodb://127.0.0.1:27017/yelpCamp')
.then(() => {
    console.log("Database Connected");
})
.catch(e => {
    console.log("Failed DB Connection:", e);
})

const seedDb = async (flatList) => {
    await Campground.deleteMany({});
    for (let item of flatList) {
        try {
            const camp = new Campground(item);
            await camp.save(); 
        } catch (e) {
            console.log("Error while inserting campgrounds")
        }
    }
}

seedDb(flattenList(cities, generateRandomNumbers(753, 50)))
.then(() => {
    mongoose.connection.close();
});