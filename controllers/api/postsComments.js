const asyncHandler = require("express-async-handler");
const { body, validationResult, param} = require('express-validator');

const Posts = require('../../models/posts');
const PostsComments = require('../../models/postsComments');
const Users = require('../../models/users');

const getPostsComments = asyncHandler(async (req, res, next) => {
        const post_id = req.query.post_id;
        const skip = req.query.skip ?? 0;
        const limit = req.query.limit ?? 50;

        const posts = await PostsComments.find({...post_id && {post_id}}).skip(skip).limit(limit).populate('user_id');
        return res.send(posts);
});

const createPostComment = [
    body('body').trim().isLength({min:1, max:300}).escape(),
    body('post_id').isMongoId().notEmpty(),
    body('user_id').isMongoId().notEmpty(),
    asyncHandler(async (req, res, next) => {
        const { body, user_id, post_id, } = req.body;

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

        const newPostComment = await PostsComments.create({body, post_id, user_id, created_at: now, updated_at:now});

        res.json(newPostComment);
    })
]

const updatePostComment = [
    param('id').isMongoId,
    body('body').trim().isLength({min:1, max:300}).escape(),
    asyncHandler(async (req, res, next) => {
        const {id,} = req.params;
        const { body, } = req.body;

        const result = validationResult(req);
        const errors = result.errors;

        if(errors.length){
            return res.status(400).json(errors);
        }

        const postComment = await PostsComments.findById(id);
        const postExist = postComment !== null;

        if(!postExist){
            const error = new Error('No such post comment');
            error.code = 400
            return next(error);
        }

        const now = Date.now();

        const postBody = {
            body,
            updated_at: now,
        }
        await PostsComments.findByIdAndUpdate(postComment._id, postBody);
        const updatedPostComment = await PostsComments.findById(id)

        res.json(updatedPostComment);
    })
]

const deletePostComment =  [
    param('id').isMongoId(),
    asyncHandler(async (req, res, next) => {
        const {id,} = req.params;

        const result = validationResult(req);
        const errors = result.errors;

        if(errors.length){
            return res.status(400).json(errors);
        }

        const postComment = await PostsComments.findById(id);
        const postExist = postComment !== null;

        if(!postExist){
            const error = new Error('No such post comment');
            error.code = 400
            return next(error);
        }

        await PostsComments.findByIdAndDelete(postComment._id);

        res.send(true);
})]


module.exports = {
    getPostsComments,
    createPostComment,
    updatePostComment,
    deletePostComment,
};
