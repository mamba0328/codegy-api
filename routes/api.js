const express = require('express');
const router = express.Router();

const usersRouter = require('./users')
const authorsRouter = require('./authors')
const postsRouter = require('./posts')


router.use('/users', usersRouter);
router.use('/authors', authorsRouter);
router.use('/posts', postsRouter);

router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});


module.exports = router;
