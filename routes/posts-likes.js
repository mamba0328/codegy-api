const express = require('express');
const router = express.Router();

const {getPostsLikes, createPostLike, deletePostLike} = require('../controllers/postsLikes')

router.get('/', getPostsLikes);

router.post('/', createPostLike);

router.delete('/:id', deletePostLike);

module.exports = router;
