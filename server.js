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

app.get('/campgrounds', async (req,res) => {
    const campgrounds  = await Campground.find({});
    res.render('campgrounds/index' , { campgrounds });
})

app.get('/campgrounds/new', (req,res) => {
    res.render('campgrounds/new');
})

app.get('/campgrounds/:id', async (req,res) => {
    const campground  = await Campground.findById(req.params.id);
    res.render('campgrounds/show' , { campground });
})

app.get('/campgrounds/:id/edit', async (req,res) => {
    const campground  = await Campground.findById(req.params.id);
    res.render('campgrounds/edit' , { campground });
})

app.post('/campgrounds', async (req,res) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
})

app.put('/campgrounds/:id', async (req,res) => {
    const campground = req.body.campground;
    const id = req.params.id;
    await Campground.findByIdAndUpdate(id, campground, {runValidators: true, returnDocument: 'after'});
    res.redirect(`/campgrounds/${id}`);
})

app.delete('/campgrounds/:id', async (req,res) => {
    const id = req.params.id;
    await Campground.findByIdAndDelete(id);
    res.redirect(`/campgrounds`);
})

app.get('/', (req,res) => {
    res.render('home');
})

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
})