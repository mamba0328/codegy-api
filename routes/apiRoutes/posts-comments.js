const express = require('express');
const passport = require('../../passport/passportAuthenticate');
const router = express.Router();

const {getPostsComments, createPostComment, updatePostComment, deletePostComment} = require('../../controllers/api/postsComments')

router.get('/', getPostsComments);

router.post('/',  passport.authenticate('jwt', { session: false }), createPostComment);

router.put('/:id',  passport.authenticate('jwt', { session: false }), updatePostComment);

router.delete('/:id',  passport.authenticate('jwt', { session: false }), deletePostComment);

module.exports = router;
