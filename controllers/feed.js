const { validationResult } = require("express-validator");

const Post = require('../models/post');

module.exports.getPosts = (req, res, next) => {
    res.status(200).json({ 
        posts: [{
            _id: '1',
            title: 'First post',
            content: 'This is the first post',
            imageUrl: 'images/rubber_duck.jpg',
            creator: {
                name: 'Márcio Casagrande'
            },
            createdAt: new Date()
        }]
    });
};

module.exports.postPost = (req, res, next) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed, entered data is incorrect');
        error.status = 422;
        error.details = errors.array();
        throw error;
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
            if (!err.status) {
                err.status = 500;
            }
            if (!err.details) {
                err.details = "On postPost when trying to save a post"
            }
            next(err);
        });
}