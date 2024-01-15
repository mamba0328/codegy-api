require('dotenv').config();

const Users = require("../models/users");
const Authors = require("../models/authors");

const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.jwtFromPayload = ExtractJwt.fromBodyField();
opts.secretOrKey = process.env.JWT_SECRET; //normally store this in process.env.secret


module.exports = new JwtStrategy(opts, async function(jwt_payload, done) {
    try {
        const isAuthor = jwt_payload.is_author;
        const Model = isAuthor ? Authors : Users;
        const entity = await Model.findById(jwt_payload._id);
        const entityExist = entity !== null;

        if(!entityExist){
            return done(null, false);
        }

        return done(null, entity);
    } catch (error){
        return done(error, false);
    }
});