const express = require('express');
const passport = require('../../passport/passportAuthenticate');
const router = express.Router();

const {getPostsLikes, createPostLike, deletePostLike} = require('../../controllers/api/postsLikes')

router.get('/',  passport.authenticate('jwt', { session: false }), getPostsLikes);

router.post('/', passport.authenticate('jwt', { session: false }),  createPostLike);

router.delete('/',  passport.authenticate('jwt', { session: false }), deletePostLike);

module.exports = router;
