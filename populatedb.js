const mongoose = require('mongoose');
const Authors = require('./models/authors');
const Users = require('./models/users');
const PostsLikes = require('./models/postsLikes');
const PostsComments = require('./models/postsComments');
const Posts = require('./models/posts');


require('dotenv').config()

mongoose.connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

db.once('open', async () => {
    try {
        console.log('Creating Authors...');
        const author = await createAuthor();
        console.log('Author created:', author);

        console.log('Creating Users...');
        const user = await createUsers();
        console.log('User created:', user);

        console.log('Creating Posts...');
        const post = await createPosts(author._id);
        console.log('Posts created:', post);

        console.log('Creating Posts Likes...');
        await createPostsLikes(post._id, user._id);
        console.log('Posts Likes created.');

        console.log('Creating Posts Comments...');
        await createPostsComments(post._id, user._id);
        console.log('Posts Comments created.');

        console.log('Database populated with real data!');
        process.exit(0);
    } catch (err) {
        console.error('Error populating database:', err);
        process.exit(1);
    }
});

async function createAuthor() {
    const author = await Authors.create({
        password: 'author_password_1',
        created_at: new Date(),
        updated_at: new Date(),
        username: 'author_one',
    });

    return author;
}

async function createUsers() {
    const user = await Users.create({
        email: 'user@example.com',
        password: 'user_password_1',
        username: 'user_one',
        first_name: 'John',
        last_name: 'Doe',
        created_at: new Date(),
        updated_at: new Date(),
    });

    return user;
}

async function createPosts(authorId) {
    const post = await Posts.create({
        title: 'First Post Title',
        body: 'This is the body of the first post.',
        author_id: authorId,
        status:1,
        created_at: new Date(),
        updated_at: new Date(),
    });

    return post;
}

async function createPostsLikes(postId, userId) {
    const postLike = await PostsLikes.create({
        post_id: postId,
        user_id: userId,
        created_at: new Date(),
    });

    return postLike;
}

async function createPostsComments(postId, userId) {
    const postComment = await PostsComments.create({
        body: 'This is a comment.',
        post_id: postId,
        user_id: userId,
        status: 1,
        created_at: new Date(),
        updated_at: new Date(),
    });

    return postComment;
}
