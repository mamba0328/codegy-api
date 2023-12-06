const express = require('express');
const router = express.Router();

const {getPostsComments, createPostComment, updatePostComment, deletePostComment} = require('../../controllers/api/postsComments')

router.get('/', getPostsComments);

router.post('/', createPostComment);

router.put('/:id', updatePostComment);

router.delete('/:id', deletePostComment);

module.exports = router;
