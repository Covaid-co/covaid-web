const express = require('express');
const router = express.Router();

router.get('/google', function (req, res) {
    return res.status(200).json({
        google: "AIzaSyCikN5Wx3CjLD-AJuCOPTVTxg4dWiVFvxY"
    });
});

router.get('/mapbox', function (req, res) {
    return res.status(200).json({
        mapbox: "test"
    });
});

module.exports = router;