const Users = require("../models/users");
require('dotenv').config();
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_SECRET; //normally store this in process.env.secret

module.exports = new JwtStrategy(opts, async function(jwt_payload, done) {
    try {
        const user = await Users.findById(jwt_payload._id);
        const userExist = user !== null;

        if(!userExist){
            return done(null, false);
        }

        return done(null, user);
    } catch (error){
        return done(error, false);
    }
});