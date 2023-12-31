const express = require('express');
const router = express.Router();

const usersRouter = require('./apiRoutes/users')
const authorsRouter = require('./apiRoutes/authors')
const postsRouter = require('./apiRoutes/posts')
const postsCommentsRouter = require('./apiRoutes/posts-comments')
const postsLikesRouter = require('./apiRoutes/posts-likes')
const verifyJWTRouter = require('./apiRoutes/verify-jwt')
const refreshRouter = require("./refresh");


router.use('/users', usersRouter);
router.use('/authors', authorsRouter);
router.use('/posts', postsRouter);
router.use('/posts-comments', postsCommentsRouter);
router.use('/posts-likes', postsLikesRouter);
router.use('/verify-jwt', verifyJWTRouter);
router.use('/refresh', refreshRouter);

router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});


module.exports = router;
