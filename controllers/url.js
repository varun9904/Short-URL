const shortid = require('shortid');
const URL = require("../models/url");

async function handlegenerateNewShortURL(req, res) {
    const body = req.body;
    if (!body.url) return res.status(400).json({ error: 'URL is required' });

    const shortID = shortid();
    await URL.create({
        shortId: shortID,
        redirectURL: body.url,
        visitHistory: [],
        createdBy: req.user._id,
    });
    
    return res.json({ id: shortID });
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
    
    const result = await URL.findOneAndDelete({ 
        shortId,
        createdBy: req.user._id 
    });

    if (!result) {
        return res.status(404).send("URL not found or you don't have permission to delete it.");
    }

    return res.redirect('/'); 
}

module.exports = {
    handlegenerateNewShortURL,
    handleGetAnalytics,
    handleDeleteUrl
};