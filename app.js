const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const { connectToMongoDB } = require('./db/connectMongoDB');

const indexRouter = require('./routes/index');
const apiRouter = require('./routes/api');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(connectToMongoDB)

app.use('/', indexRouter);
app.use('/api', apiRouter);

app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(err.code ?? 500).send(err.message);
});

module.exports = app;
