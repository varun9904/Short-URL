const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose')
require('dotenv').config();

const {restrictToLoggedInUserOnly} = require('./middleware/auth');
const URL = require('./models/url');
const UserURL = require("./models/userUrl")
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

    
    const urlsWithPagination = await UserURL.aggregate([
        {
            $match: {
                userId: new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $lookup: {
                from: 'urls',               
                localField: 'urlId',
                foreignField: '_id',
                as: 'urlData'
            }
        },
        {
            $unwind: '$urlData'           
        },
        {
            $skip: skip
        },
        {
            $limit: limit
        },
        {
            $replaceRoot: { newRoot: '$urlData' } 
        }
    ]);

    const totalLinks = await UserURL.countDocuments({ userId: req.user._id });
    const totalPages = Math.ceil(totalLinks / limit);

    return res.render('home', {
        urls: urlsWithPagination,
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