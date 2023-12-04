const mongoose = require('mongoose');
const {Schema} = mongoose;

const posts_comments = new Schema({
    body: {type: Schema.Types.Mixed, required: true, minLength:1, maxLength: 300, },
    post_id: {type: Schema.Types.ObjectId, ref: "posts", required: true},
    user_id: {type: Schema.Types.ObjectId, ref: "users", required: true},
    status: {type: Schema.Types.Number, required: true, default:1,},
    created_at: {type: Schema.Types.Date, required: true, },
    updated_at: {type: Schema.Types.Date, },
})

module.exports = mongoose.model('posts_com,ments', posts_comments)