const shortid = require('shortid')
const URL = require('../models/url')

async function handleGenerateNewShortURL(req, res) {
    const body = req.body;
    if (!body.url) return res.status(400).json({ error: "url is required" });
    const shortID = shortid();

    await URL.create({
        shortId: shortID,
        redirectURL: body.url,
        visitHistory: [],
        createdBy: req.user._id
    });
    return res.render('home', { id: shortID })
}

async function handleGetAnalytics(req, res) {

    try {
        const shortId = req.params.shortId;

        const result = await URL.findOne({ shortId });

        if (!result) {
            return res.status(404).json({ message: "URL not found" });
        }

        return res.json({
            totalClicks: result.visitHistory.length,
            analytics: result.visitHistory
        });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
}

module.exports = { handleGenerateNewShortURL, handleGetAnalytics }