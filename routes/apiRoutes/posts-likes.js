const express = require('express');
const router = express.Router();

const {getPostsLikes, createPostLike, deletePostLike} = require('../../controllers/api/postsLikes')

router.get('/', getPostsLikes);

router.post('/', createPostLike);

router.delete('/', deletePostLike);

module.exports = router;
