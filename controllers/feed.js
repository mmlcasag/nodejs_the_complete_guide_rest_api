const path = require('path');
const fs = require('fs');

const { validationResult } = require("express-validator");

const Post = require('../models/post');

//////////////////////////////////////////////////////////////////////////////////////////

const handleError = (err, status, details) => {
    if (!err.status) {
        err.status = status;
    }
    if (!err.details) {
        err.details = details;
    }
    next(err);
}

//////////////////////////////////////////////////////////////////////////////////////////

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

//////////////////////////////////////////////////////////////////////////////////////////

const clearImage = filePath => {
    filePath = path.join(__dirname, '..', filePath);

    fs.unlink(filePath, err => {
        if (err) {
            throwNewError('Error while trying to delete image', 500, err);
        }
    });
}

//////////////////////////////////////////////////////////////////////////////////////////

module.exports.getPosts = (req, res, next) => {
    const curPage = req.query.page || 1;
    const perPage = 2;

    let totalItems;
    Post.find()
        .countDocuments()
        .then(countPosts => {
            totalItems = countPosts;
            
            return Post.find()
                .skip((curPage - 1) * perPage)
                .limit(perPage)
        })
        .then(posts => {
            res.status(200).json({ 
                message: 'Posts fetched successfully', 
                posts: posts,
                totalItems: totalItems
            });
        })
        .catch(err => {
            handleError(err, 500, 'On getPosts when trying to find all the posts');
        });
};

//////////////////////////////////////////////////////////////////////////////////////////

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

//////////////////////////////////////////////////////////////////////////////////////////

module.exports.postPost = (req, res, next) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        throwNewError('Validation failed, entered data is incorrect', 422, errors.array());
    }
    if (!req.file) {
        throwNewError('Validation failed, image is required', 422, 'Image is required');
    }

    const title = req.body.title;
    const content = req.body.content;
    const imageUrl = req.file.path.replace("\\" ,"/");
    
    const post = new Post({
        title: title,
        content: content,
        imageUrl: imageUrl,
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

//////////////////////////////////////////////////////////////////////////////////////////

module.exports.putPost = (req, res, next) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        throwNewError('Validation failed, entered data is incorrect', 422, errors.array());
    }
    
    const postId  = req.params.postId;
    const title   = req.body.title;
    const content = req.body.content;
    
    let imageUrl;

    if (req.file) {
        imageUrl = req.file.path.replace("\\" ,"/");
    } else {
        imageUrl = req.body.image;
    }

    if (!imageUrl) {
        throwNewError('Validation failed, image is required', 422, 'Image is required');
    }

    Post.findById(postId)
        .then(post => {
            if (!post) {
                throwNewError('Could not find post', 404);
            }

            // if the image changed...
            if (imageUrl !== post.imageUrl) {
                // ... i want to get rid of the old image
                clearImage(post.imageUrl);
            }
            
            post.title = title;
            post.content = content;
            post.imageUrl = imageUrl;

            return post.save();
        })
        .then(result => {
            return res.status(200).json({
                message: 'Post updated successfully',
                post: result
            });
        })
        .catch(err => {
            handleError(err, 500, 'On putPost when trying to findById a post');
        });
}

//////////////////////////////////////////////////////////////////////////////////////////

module.exports.deletePost = (req, res, next) => {
    const postId = req.params.postId;

    Post.findById(postId)
        .then(post => {
            if (!post) {
                throwNewError('Could not find post', 404);
            }

            // #1 TODO: check logged in user

            // #2 delete the post image
            clearImage(post.imageUrl);
            
            // #3 delete the post
            return Post.findByIdAndRemove(postId);
        })
        .then(result => {
            res.status(200).json({
                message: 'Post deleted successfully'
            });
        })
        .catch(err => {
            handleError(err, 500, 'On deletePost when trying to findById a post');
        });
}