const mongoose = require('mongoose');
const {Schema} = mongoose;

const users = new Schema({
    id: {type: Schema.Types.ObjectId, required: true},
    email: {type: Schema.Types.String, required: true, minLength:5, },
    password: {type: Schema.Types.String, required: true, minLength:8, },
    username: {type: Schema.Types.String, required: true, },
    first_name: {type: Schema.Types.String, },
    last_name: {type: Schema.Types.String, },
    created_at: {type: Schema.Types.Date, required: true, },
    updated_at: {type: Schema.Types.Date, },
})

module.exports = mongoose.model('users', users)