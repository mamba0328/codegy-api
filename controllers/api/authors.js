const asyncHandler = require("express-async-handler");
const { body, validationResult, param} = require('express-validator');
const bcrypt = require('bcryptjs')

const Authors = require('../../models/authors');

const getAuthors = asyncHandler(async (req, res, next) => {
        const {username} = req.query;
        const skip = req.query.skip ?? 0;
        const limit = req.query.limit ?? 50;

        const authors = await Authors.find({...username && {username}, }).skip(skip).limit(limit);
        return res.send(authors);
});

const createAuthor = [
    body('email').trim().isEmail().normalizeEmail(),
    body('username').isLength({min:1, max:20}).escape(),
    body('password').isLength({min:8, max:64}),
    body('confirmPassword').custom((value, { req }) => {
        return value === req.body.password;
    }),
    // body('avatar').trim().isLength({min:8, max:20}).escape(),
    asyncHandler(async (req, res, next) => {
        const {  username, password, avatar, } = req.body;

        const result = validationResult(req);
        const errors = result.errors;

        if(errors.length){
            return res.status(400).json(errors);
        }

        const authorExist = await Authors.findOne({username});

        if(authorExist){
            return res.status(400).send({msg: 'Author with such username already exist'});
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const now = Date.now();

        const newAuthor = await Authors.create({
            password: hashedPassword,
            username,
            ...avatar && {avatar},
            created_at: now,
            updated_at: now,
        });


        const authorWithoutPassword = { ...newAuthor._doc };
        delete authorWithoutPassword.password;

        res.json(authorWithoutPassword);
    })
]

const updateAuthor = [
    param('id').isMongoId(),
    body('username').if(value => value).trim().isLength({min:1, max:20}).escape(),
    asyncHandler(async (req, res, next) => {
        const {id,} = req.params;
        const {username: queryUserName} = req.query;
        const { username, first_name, last_name, } = req.body;

        const author = id ? await Authors.findById(id) : await Authors.findOne({username: queryUserName});
        const authorExist = author !== null;

        if(!authorExist){
            const error = new Error('No such author');
            error.code = 400
            return next(error);
        }

        const result = validationResult(req);
        const errors = result.errors;

        if(errors.length){
            return res.status(400).json(errors);
        }

        const now = Date.now();

        const authorBody = {
            _id:id,
            username,
            updated_at: now,
        }
        await Authors.findByIdAndUpdate(author._id, authorBody);
        const updatedUser = await Authors.findById(id)

        res.json(updatedUser);
    })
]

const deleteAuthor =  [
    param('id').isMongoId(),
    asyncHandler(async (req, res, next) => {
        const {id,} = req.params;
        const {username} = req.query;

        const result = validationResult(req);
        const errors = result.errors;

        if(errors.length){
            return res.status(400).json(errors);
        }

        const author = id ? await Authors.findById(id) : await Authors.findOne({username});
        const authorExist = author !== null;

        if(!authorExist){
            const error = new Error('No such author');
            error.code = 400
            return next(error);
        }

        await Authors.findByIdAndDelete(author._id);

        res.send(true);
})]


module.exports = {
    getAuthors,
    createAuthor,
    updateAuthor,
    deleteAuthor,
};
