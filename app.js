const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const logger = require('morgan');

const passport = require('passport');
const jwtStrategry  = require("./strategies/jwt")
passport.use(jwtStrategry);

const { connectToMongoDB } = require('./db/connectMongoDB');

const indexRouter = require('./routes/index');
const apiRouter = require('./routes/api');
const loginRouter = require('./routes/login');

const app = express();

app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(connectToMongoDB)

app.use('/', indexRouter);
app.use('/api', passport.authenticate('jwt', { session: false }), apiRouter);
app.use('/login', loginRouter);

app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(err.code ?? 500).send(err.message);
});

module.exports = app;
