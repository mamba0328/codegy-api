const express = require('express');
const passport = require('../../passport/passportAuthenticate');
const router = express.Router();

const {getPosts, createPost, updatePost, deletePost, getSinglePost} = require('../../controllers/api/posts')

router.get('/', getPosts);

router.get('/:id', getSinglePost);

router.post('/',  passport.authenticate('jwt', { session: false }), createPost);

router.put('/:id',  passport.authenticate('jwt', { session: false }), updatePost);

router.delete('/:id',  passport.authenticate('jwt', { session: false }), deletePost);

module.exports = router;
