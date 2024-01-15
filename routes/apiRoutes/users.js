const express = require('express');
const passport = require('../../passport/passportAuthenticate');
const router = express.Router();

const { getUsers, createUser, getCurrentUser, updateUser, deleteUser } = require('../../controllers/api/users')

router.get('/', getUsers);

router.get('/get-current', getCurrentUser);

router.post('/', createUser);

router.put('/:id',  passport.authenticate('jwt', { session: false }), updateUser);

router.delete('/:id',  passport.authenticate('jwt', { session: false }), deleteUser);

module.exports = router;
