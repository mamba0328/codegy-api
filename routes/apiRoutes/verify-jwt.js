const express = require('express');
const router = express.Router();

const verifyJWT = require('../../controllers/api/verifyJWT')

router.get('/', verifyJWT);

module.exports = router;
