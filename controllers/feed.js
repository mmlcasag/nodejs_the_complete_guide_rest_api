const { validationResult } = require("express-validator");

const Post = require('../models/post');

const handleError = (err, status, details) => {
    if (!err.status) {
        err.status = status;
    }
    if (!err.details) {
        err.details = details;
    }
    next(err);
}

const throwNewError = (message, status, details) => {
    const error = new Error(message);
    if (status) {
        error.status = status;
    }
    if (details) {
        error.details = details
    }
    throw error;
}

module.exports.getPosts = (req, res, next) => {
    Post.find()
        .then(posts => {
            res.status(200).json({ 
                message: 'Posts fetched successfully', 
                posts: posts
            });
        })
        .catch(err => {
            handleError(err, 500, 'On getPosts when trying to find all the posts');
        });
};

module.exports.getPost = (req, res, next) => {
    const postId = req.params.postId;

    Post.findById(postId)
        .then(post => {
            if (!post) {
                throwNewError('Could not find post', 404);
            }
            
            res.status(200).json({
                message: 'Post fetched successfully',
                post: post
            });
        })
        .catch(err => {
            handleError(err, 500, 'On getPost when trying to findById a post');
        });
}

module.exports.postPost = (req, res, next) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        throwNewError('Validation failed, entered data is incorrect', 422, errors.array());
    }
    
    const title = req.body.title;
    const content = req.body.content;
    
    const post = new Post({
        title: title,
        content: content,
        imageUrl: 'images/rubber_duck.jpg',
        creator: { 
            name: 'Márcio Luís Casagrande'
        }
    });

    post.save()
        .then(result => {
            res.status(201).json({
                message: 'Post created successfully',
                post: result
            });
        })
        .catch(err => {
            handleError(err, 500, 'On postPost when trying to save a post');
        });
}