const express = require('express');
const { handlegenerateNewShortURL, handleGetAnalytics, handleDeleteUrl } = require('../controllers/url');

const router = express.Router();

router.post('/', handlegenerateNewShortURL);

router.get('/analytics/:shortId', handleGetAnalytics);

router.get('/delete/:shortId', handleDeleteUrl);


module.exports = router;