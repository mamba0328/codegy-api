const express = require('express');
const passport = require('../../passport/passportAuthenticate');
const router = express.Router();


const {getAuthors, createAuthor, updateAuthor, deleteAuthor} = require('../../controllers/api/authors')

router.get('/', getAuthors);

router.post('/',  passport.authenticate('jwt', { session: false }), createAuthor);

router.put('/:id',  passport.authenticate('jwt', { session: false }), updateAuthor);

router.delete('/:id',  passport.authenticate('jwt', { session: false }), deleteAuthor);

module.exports = router;
