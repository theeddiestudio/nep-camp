const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');

const { Campground } = require('./models');

mongoose.connect('mongodb://127.0.0.1:27017/yelpCamp')
.then(() => {
    console.log("Database Connected");
})
.catch(e => {
    console.log("Failed DB Connection:", e);
})

const app = express();
const port = 3000;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));

app.get('/makecampground', (req,res) => {
    res.render('home');
})

app.get('/', (req,res) => {
    res.render('home');
})

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
})