const asyncHandler = require("express-async-handler");
const { body, validationResult } = require('express-validator');

const PostsLikes = require('../models/postsLikes');
const Posts = require('../models/posts');
const Users = require('../models/users');

const getPostsLikes = asyncHandler(async (req, res, next) => {
        const skip = req.query.skip ?? 0;
        const limit = req.query.limit ?? 50;

        const posts = await PostsLikes.find().skip(skip).limit(limit);
        return res.send(posts);
});

const createPostLike = [
    body('post_id').notEmpty(),
    body('user_id').notEmpty(),
    asyncHandler(async (req, res, next) => {
        const { user_id, post_id, } = req.body;

        const result = validationResult(req);
        const errors = result.errors;

        if(errors.length){
            return res.status(400).json(errors);
        }

        const postExist = await Posts.findById(post_id);

        if(!postExist){
            const error = new Error('No such author');
            error.code = 400
            return next(error);
        }

        const userExists = await Users.findById(user_id);

        if(!userExists){
            const error = new Error('No such user');
            error.code = 400
            return next(error);
        }

        const now = Date.now();

        const newPostLike = await PostsLikes.create({post_id, user_id, created_at: now, });

        res.json(newPostLike);
    })
]

const deletePostLike =  asyncHandler(async (req, res, next) => {
    const {id,} = req.params;

    const postLike = await PostsLikes.findById(id);
    const postExist = postLike !== null;

    if(!postExist){
        const error = new Error('No such post comment');
        error.code = 400
        return next(error);
    }

    await PostsLikes.findByIdAndDelete(postLike._id);

    res.send(true);
})


module.exports = {
    getPostsLikes,
    createPostLike,
    deletePostLike,
};
