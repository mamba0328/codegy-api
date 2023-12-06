const asyncHandler = require("express-async-handler");
const { body, validationResult, param } = require('express-validator');

const Posts = require('../../models/posts');
const Authors = require('../../models/authors');

const getPosts = asyncHandler(async (req, res, next) => {
        const skip = req.query.skip ?? 0;
        const limit = req.query.limit ?? 50;

        const posts = await Posts.find().skip(skip).limit(limit);
        return res.send(posts);
});

const createPost = [
    body('title').trim().isLength({min:1, max:60}).escape(),
    body('body').trim().isLength({min:1,}).escape(),
    body('author_id').notEmpty(),
    asyncHandler(async (req, res, next) => {
        const { title, body, tags, author_id, } = req.body;

        const result = validationResult(req);
        const errors = result.errors;

        if(errors.length){
            return res.status(400).json(errors);
        }

        const authorExist = await Authors.findById(author_id);

        if(!authorExist){
            const error = new Error('No such author');
            error.code = 400
            return next(error);
        }

        const now = Date.now();

        const newPosts = await Posts.create({title, body, tags, author_id, created_at: now, updated_at:now});

        res.json(newPosts);
    })
]

const updatePost = [
    param('id').isMongoId(),
    body('title').trim().isLength({min:1, max:60}).escape(),
    body('body').trim().isLength({min:1,}).escape(),
    asyncHandler(async (req, res, next) => {
        const {id,} = req.params;
        const { title, body, tags, } = req.body;

        const post = await Posts.findById(id);
        const postExist = post !== null;

        if(!postExist){
            const error = new Error('No such post');
            error.code = 400
            return next(error);
        }

        const result = validationResult(req);
        const errors = result.errors;

        if(errors.length){
            return res.status(400).json(errors);
        }

        const now = Date.now();

        const postBody = {
            ...title && {title},
            ...body && {body},
            ...tags && {tags},
            updated_at: now,
        }
        await Posts.findByIdAndUpdate(post._id, postBody);
        const updatedPost = await Posts.findById(id)

        res.json(updatedPost);
    })
]

const deletePost =  [
    param('id').isMongoId(),
    asyncHandler(async (req, res, next) => {
        const {id,} = req.params;

        const result = validationResult(req);
        const errors = result.errors;

        if(errors.length){
            return res.status(400).json(errors);
        }

        const post = await Posts.findById(id);
        const postExist = post !== null;

        if(!postExist){
            const error = new Error('No such post');
            error.code = 400
            return next(error);
        }

        await Posts.findByIdAndDelete(post._id);

        res.send(true);
})]


module.exports = {
    getPosts,
    createPost,
    updatePost,
    deletePost,
};
