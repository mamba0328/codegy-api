const express = require('express');
const router = express.Router();

const verifyJWT = require('../../controllers/api/verifyJWT')
const passport = require("../../passport/passportAuthenticate");

router.get('/',  passport.authenticate('jwt', { session: false }), verifyJWT);

module.exports = router;
