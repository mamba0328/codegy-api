const asyncHandler = require("express-async-handler");
const { body, query, validationResult } = require('express-validator');

const PostsLikes = require('../../models/postsLikes');
const Posts = require('../../models/posts');
const Users = require('../../models/users');

const getPostsLikes = asyncHandler(async (req, res, next) => {
        const skip = req.query.skip ?? 0;
        const limit = req.query.limit ?? 50;

        const posts = await PostsLikes.find().skip(skip).limit(limit);
        return res.send(posts);
});

const createPostLike = [
    body('post_id').isMongoId().notEmpty(),
    body('user_id').isMongoId().notEmpty(),
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

        const postsLikeAlreadyExist = await PostsLikes.findOne({post_id, user_id,})

        if(postsLikeAlreadyExist){
            const error = new Error('Post\'s like already exist');
            error.code = 400
            return next(error);
        }

        const now = Date.now();

        const newPostLike = await PostsLikes.create({post_id, user_id, created_at: now, });

        res.json(newPostLike);
    })
]

const deletePostLike =  [
    query('user_id').isMongoId(),
    query('post_id').isMongoId(),

    asyncHandler(async (req, res, next) => {
        const {user_id, post_id,} = req.query;

        const result = validationResult(req);
        const errors = result.errors;

        if(errors.length){
            return res.status(400).json(errors);
        }

        const postLike = await PostsLikes.findOne({post_id, user_id,})
        const postExist = postLike !== null;

        if(!postExist){
            const error = new Error('No such post like');
            error.code = 400
            return next(error);
        }

        await PostsLikes.findByIdAndDelete(postLike._id);

        res.send(true);
}),]


module.exports = {
    getPostsLikes,
    createPostLike,
    deletePostLike,
};
