const shortid = require('shortid');
const URL = require("../models/url");
const UserURL = require("../models/userUrl");

async function handlegenerateNewShortURL(req, res) {
    const body = req.body;
    if (!body.url) return res.status(400).json({ error: 'URL is required' });

    let urlEntry = await URL.findOne({ redirectURL: body.url });

    if(!urlEntry){
        const shortID = shortid();
        urlEntry = await URL.create({
            shortId: shortID,
            redirectURL: body.url,
            visitHistory: [],
        });
    }

    const userLinkExists = await UserURL.findOne({
        userId: req.user._id,
        urlId: urlEntry._id,
    });

    if (!userLinkExists) {
        await UserURL.create({
            userId: req.user._id,
            urlId: urlEntry._id,
        });
    }


    return res.json({ id: urlEntry.shortId });
}

async function handleGetAnalytics(req, res) {
    const shortId = req.params.shortId;
    const result = await URL.findOne({ shortId });
    
    return res.json({
        totalClicks: result.visitHistory.length,
        analytics: result.visitHistory,
    });
}

async function handleDeleteUrl(req, res) {
    const shortId = req.params.shortId;

    const urlEntry = await URL.findOne({ shortId });
    if (!urlEntry) {
        return res.status(404).send("URL not found.");
    }

    await UserURL.findOneAndDelete({
        urlId: urlEntry._id,
        userId: req.user._id,
    });

    const remainingLinks = await UserURL.countDocuments({ urlId: urlEntry._id });
    
    if (remainingLinks === 0) {
        await URL.findByIdAndDelete(urlEntry._id);
    }

    return res.redirect('/'); 
}

module.exports = {
    handlegenerateNewShortURL,
    handleGetAnalytics,
    handleDeleteUrl
};