const express = require('express');
const router = express.Router();

const usersRouter = require('./users')


router.use('/users', usersRouter);

router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});


module.exports = router;