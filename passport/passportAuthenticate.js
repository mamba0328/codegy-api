const passport = require('passport');
const jwtStrategry  = require("../strategies/jwt")
passport.use(jwtStrategry);
module.exports = passport;