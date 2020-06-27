const path = require('path');
const fs = require('fs');

const { validationResult } = require("express-validator");

const Post = require('../models/post');
const User = require('../models/user');
const errorUtils = require('../utils/error');

//////////////////////////////////////////////////////////////////////////////////////////

const clearImage = filePath => {
    if (filePath) {
        filePath = path.join(__dirname, '..', filePath);

        fs.unlink(filePath, err => {
            if (err) {
                console.log(err);
            }
        });
    }
}

//////////////////////////////////////////////////////////////////////////////////////////

// you have to specify in the function signature that this is an asynchronous function
module.exports.getPosts = async (req, res, next) => {
    const curPage = req.query.page || 1;
    const perPage = 2;
    
    try {
        // then, whenever you have asynchronous code, you can use the await keyword
        // then, javascript will run your code just the way it used to do
        // with the promises and all that stuff behind the scenes
        const totalItems = await Post.find().countDocuments();
        const posts = await Post.find().skip((curPage - 1) * perPage).limit(perPage);
        
        res.status(200).json({ 
            message: 'Posts fetched successfully', 
            posts: posts,
            totalItems: totalItems
        });
    } catch (err) {
        next(errorUtils.handleError(err, 500, 'On getPosts when trying to find all the posts'));
    }
};

//////////////////////////////////////////////////////////////////////////////////////////

module.exports.getPost = (req, res, next) => {
    const postId = req.params.postId;

    Post.findById(postId)
        .then(post => {
            if (!post) {
                errorUtils.throwNewError('Could not find post', 404);
            }
            
            res.status(200).json({
                message: 'Post fetched successfully',
                post: post
            });
        })
        .catch(err => {
            next(errorUtils.handleError(err, 500, 'On getPost when trying to findById a post'));
        });
}

//////////////////////////////////////////////////////////////////////////////////////////

module.exports.postPost = (req, res, next) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        errorUtils.throwNewError('Validation failed, entered data is incorrect', 422, errors.array());
    }
    
    const title = req.body.title;
    const content = req.body.content;
    
    let imageUrl;

    if (req.file) {
        imageUrl = req.file.path.replace("\\" ,"/");
    } else {
        imageUrl = req.body.imageUrl;
    }

    const post = new Post({
        title: title,
        content: content,
        imageUrl: imageUrl,
        creator: req.userId
    });

    let localUser;
    post.save()
        .then(result => {
            return User.findById(req.userId);
        })
        .then(user => {
            localUser = user;
            user.posts.push(post);
            return user.save();
        })
        .then(result => {
            res.status(201).json({
                message: 'Post created successfully',
                post: post,
                creator: {
                    _id: localUser._id,
                    name: localUser.name
                }
            });
        })
        .catch(err => {
            next(errorUtils.handleError(err, 500, 'On postPost when trying to save a post'));
        });
}

//////////////////////////////////////////////////////////////////////////////////////////

module.exports.putPost = (req, res, next) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        errorUtils.throwNewError('Validation failed, entered data is incorrect', 422, errors.array());
    }
    
    const postId  = req.params.postId;
    const title   = req.body.title;
    const content = req.body.content;
    
    let imageUrl;

    if (req.file) {
        imageUrl = req.file.path.replace("\\" ,"/");
    } else {
        imageUrl = req.body.imageUrl;
    }

    Post.findById(postId)
        .then(post => {
            if (!post) {
                errorUtils.throwNewError('Could not find post', 404);
            }
            if (post.creator.toString() !== req.userId) {
                errorUtils.throwNewError('Authorization failed', 403, 'Users can only update their own posts');
            }
            // if the post had an image and the image changed...
            if (imageUrl !== post.imageUrl) {
                // ... i want to get rid of the previous image
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
            next(errorUtils.handleError(err, 500, 'On putPost when trying to findById a post'));
        });
}

//////////////////////////////////////////////////////////////////////////////////////////

module.exports.deletePost = (req, res, next) => {
    const postId = req.params.postId;

    Post.findById(postId)
        .then(post => {
            if (!post) {
                errorUtils.throwNewError('Could not find post', 404);
            }
            
            // #1 check if user has permission to do so
            if (post.creator.toString() !== req.userId) {
                errorUtils.throwNewError('Authorization failed', 403, 'Users can only delete their own posts');
            }
            
            // #2 delete the post image
            clearImage(post.imageUrl);
            
            // #3 delete the post
            return Post.findByIdAndRemove(postId);
        })
        .then(result => {
            return User.findById(req.userId);
        })
        .then(user => {
            user.posts.pull(postId);
            return user.save();
        })
        .then(result => {
            res.status(200).json({
                message: 'Post deleted successfully'
            });
        })
        .catch(err => {
            next(errorUtils.handleError(err, 500, 'On deletePost when trying to findById a post'));
        });
}