const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const mongoose = require('mongoose');
const cors = require('cors');
const mountRoutes = require('./routes')

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(require('morgan')('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: 'passport-tutorial', cookie: { maxAge: 60000 }, resave: false, saveUninitialized: false }));

// Set up mongoose connection
let dev_db_url = 'mongodb+srv://debanik:Corona2020@coronacluster-9wiub.mongodb.net/test?retryWrites=true&w=majority';
let mongoDB = process.env.MONGODB_URI || dev_db_url;
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true }, );
mongoose.Promise = global.Promise;
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

require('./models/user.model');
require('./config/passport');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

mountRoutes(app);

app.listen(port, () => console.log(`Listening on port ${port}`));