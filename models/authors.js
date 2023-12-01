const mongoose = require('mongoose');
const {Schema} = mongoose;

const authors = new Schema({
    id: {type: Schema.Types.ObjectId, required: true},
    password: {type: Schema.Types.String, required: true, minLength:8, },
    created_at: {type: Schema.Types.Date, required: true, },
    updated_at: {type: Schema.Types.Date, },
    avatar: {type: Schema.Types.Buffer, }
})

module.exports = mongoose.model('authors', authors)