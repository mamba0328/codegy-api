const express = require('express');
const router = express.Router();

const {getPosts, createPost, updatePost, deletePost} = require('../../controllers/api/posts')

router.get('/', getPosts);

router.post('/', createPost);

router.put('/:id', updatePost);

router.delete('/:id', deletePost);

module.exports = router;
