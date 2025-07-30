const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose')
require('dotenv').config();

const {restrictToLoggedInUserOnly} = require('./middleware/auth');
const URL = require('./models/url');
const urlRoute = require('./routes/url');
const userRoute = require('./routes/user');

const app = express();
const PORT = 8001;


mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

app.set("view engine", "ejs");
app.set('views', path.resolve('./views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/', restrictToLoggedInUserOnly, async (req, res) => {
    const page = parseInt(req.query.page) || 1; 
    const limit = 10;
    const skip = (page - 1) * limit;
    const urls = await URL.find({ createdBy: req.user._id })
        .sort({ createdAt: -1 }) 
        .skip(skip)              
        .limit(limit);     
    const totalUrls = await URL.countDocuments({ createdBy: req.user._id });
    const totalPages = Math.ceil(totalUrls / limit);     
    return res.render('home', {
        urls: urls,
        currentPage: page,
        totalPages: totalPages,
    });  
});

app.get('/url/:shortId', async (req, res) => {
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate(
        { shortId },
        { $push: { visitHistory: { timestamp: Date.now() } } }
    );
    
    if (!entry) {
        return res.status(404).json({ error: "Short URL not found" });
    }
    
    res.redirect(entry.redirectURL);
});

app.get('/signup', (req, res) => {
    return res.render('signup');
});

app.get('/login', (req, res) => {
    return res.render('login');
});

app.use('/url', restrictToLoggedInUserOnly, urlRoute);
app.use('/user', userRoute);

app.listen(PORT, () => console.log(`Server started on PORT: ${PORT}`));