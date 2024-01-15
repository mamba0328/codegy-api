const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const logger = require('morgan');
const cors = require('cors');

const { connectToMongoDB } = require('./db/connectMongoDB');

const indexRouter = require('./routes/index');
const apiRouter = require('./routes/api');
const logoutRouter = require('./routes/logout');
const loginRouter = require('./routes/login');
const refreshRouter = require('./routes/refresh');

const app = express();

app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(connectToMongoDB)

app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method == "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
        return res.status(200).json({});
    }

    next();
});


app.use('/', indexRouter);
app.use('/api', apiRouter);
app.use('/login', loginRouter);
app.use('/logout', logoutRouter);
app.use('/refresh', refreshRouter);

app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(err.code ?? 500).send(err.message);
});

module.exports = app;
