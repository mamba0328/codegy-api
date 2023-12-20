const express = require('express');
const router = express.Router();

const refresh = require('../controllers/refresh')

router.get('/', refresh);

module.exports = router;
