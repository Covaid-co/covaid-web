const express = require('express');
const bodyParser = require('body-parser');
const mountRoutes = require('./routes')
const {MongoClient} = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;

// Set up mongoose connection
const mongoose = require('mongoose');
let dev_db_url = 'mongodb+srv://debanik:Corona2020@coronacluster-9wiub.mongodb.net/test?retryWrites=true&w=majority';
let mongoDB = process.env.MONGODB_URI || dev_db_url;
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true }, );
mongoose.Promise = global.Promise;
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
mountRoutes(app);

app.listen(port, () => console.log(`Listening on port ${port}`));