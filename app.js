const express = require('express');
const path = require('path');
const session = require('express-session');
const bodyParser = require('body-parser');
const cors = require('cors');
const mountRoutes = require('./routes');


const app = express();
// const Scheduler = require('./request_scheduler/request.scheduler')

if(process.env.PORT) {
    app.use((req, res, next) => {
        if (req.header('x-forwarded-proto') !== 'https')
        res.redirect(`https://${req.header('host')}${req.url}`)
        else
        next()
    })
}

app.use(bodyParser.json());
app.use(cors());
if (process.env.NODE_ENV !== 'test') {
    app.use(require('morgan')('dev'));
}
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: 'passport-tutorial', cookie: { maxAge: 60000 }, resave: false, saveUninitialized: false }));
mountRoutes(app);

module.exports = app;