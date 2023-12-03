const mongoose = require('mongoose');
const {Schema} = mongoose;

const users = new Schema({
    email: {type: Schema.Types.String, required: true, minLength:5, },
    password: {type: Schema.Types.String, required: true, minLength:8,  maxLength: 64, select: false},
    username: {type: Schema.Types.String, required: true, maxLength: 20,},
    first_name: {type: Schema.Types.String, },
    last_name: {type: Schema.Types.String, },
    created_at: {type: Schema.Types.Date, required: true, },
    updated_at: {type: Schema.Types.Date, },
})

module.exports = mongoose.model('users', users)