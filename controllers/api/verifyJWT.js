require('dotenv').config()
const asyncHandler = require("express-async-handler");

const verifyJWT = [
    asyncHandler(async (req, res, next) => {
        return res.status(200).json(true);
    }),
]

module.exports = verifyJWT