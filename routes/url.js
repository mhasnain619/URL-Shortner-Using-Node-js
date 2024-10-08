const express = require('express')
const router = express.Router()
const { handleGenerateNewShortURL, handleGetAnalytics } = require('../controllers/url')
// const shortid = require('shortid')

router.post('/', handleGenerateNewShortURL)
router.get('/analytics/:shortId', handleGetAnalytics)

module.exports = router