const express = require('express');
const router = express.Router();
const path = require('path');

// placeholder endpoint for testing purposes
router.get('/name', (req, res) => {
	res.send({'name': 'CoronaAid --- via Express backend'});
});

const offer_routes = require('./offer.routes.js');

router.use('/offers', offer_routes);

module.exports = app => {
	app.use('/api', router);

	// set up React build files to be served from Express
	app.use(express.static(path.join(__dirname, '/../../client/build')));

	// default to serving React files at all other endpoints 
	// (this should always be the last routed endpoint)
	app.get('*', (req, res) => {
	  res.sendFile(path.join(__dirname + '/../../client/build/index.html'))
	});
}