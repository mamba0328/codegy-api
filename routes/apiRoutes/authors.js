const express = require('express');
const router = express.Router();

const {getAuthors, createAuthor, updateAuthor, deleteAuthor} = require('../../controllers/api/authors')

router.get('/', getAuthors);

router.post('/', createAuthor);

router.put('/:id', updateAuthor);

router.delete('/:id', deleteAuthor);

module.exports = router;
