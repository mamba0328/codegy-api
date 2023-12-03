const mongoose = require('mongoose');
const {Schema} = mongoose;

const posts_likes = new Schema({
    post_id: {type: Schema.Types.ObjectId, ref: "posts", required: true},
    user_id: {type: Schema.Types.ObjectId, ref: "users", required: true},
    created_at: {type: Schema.Types.Date, required: true, },
})

module.exports = mongoose.model('posts_likes', posts_likes)