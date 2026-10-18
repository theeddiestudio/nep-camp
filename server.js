const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');

const app = express();
const port = 3000;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));

app.get('/', (req,res) => {
    res.send('<h1>Landing Page</h1>');
})

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
})