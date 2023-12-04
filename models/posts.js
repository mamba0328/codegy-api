const mongoose = require('mongoose');
const {Schema} = mongoose;

const posts = new Schema({
    title: {type: Schema.Types.String, required: true, minLength:1, maxLength: 60, },
    body: {type: Schema.Types.Mixed, required: true, minLength:1,},
    tags: {type: Schema.Types.Array, },
    author_id: {type: Schema.Types.ObjectId, ref: "authors", required: true},
    status: {type: Schema.Types.Number, required: true, default: 1,},
    created_at: {type: Schema.Types.Date, required: true, },
    updated_at: {type: Schema.Types.Date, },
})

module.exports = mongoose.model('posts', posts)