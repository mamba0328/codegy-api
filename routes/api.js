const express = require('express');
const router = express.Router();

const usersRouter = require('./users')
const authorsRouter = require('./authors')
const postsRouter = require('./posts')
const postsCommentsRouter = require('./posts-comments')
const postsLikesRouter = require('./posts-likes')


router.use('/users', usersRouter);
router.use('/authors', authorsRouter);
router.use('/posts', postsRouter);
router.use('/posts-comments', postsCommentsRouter);
router.use('/posts-likes', postsLikesRouter);

router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});


module.exports = router;
