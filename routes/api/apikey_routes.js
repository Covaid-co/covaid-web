const express = require('express');
const router = express.Router();
require('dotenv').config();

router.get('/google', function (req, res) {
    return res.status(200).json({
        google: process.env.GOOGLE_MAPS_API_KEY
    });
});

router.get('/mapbox', function (req, res) {
    return res.status(200).json({
        mapbox: process.env.MAPBOX_TOKEN
    });
});

module.exports = router;