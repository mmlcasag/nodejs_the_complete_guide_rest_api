const { body } = require('express-validator');

module.exports.postPostValidator = [
    body('title')
        .not().isEmpty().withMessage('Title is required').bail()
        .isLength({ min: 5 }).withMessage('Title must be at least 5 characters long').bail()
        .trim(),
    body('content')
        .not().isEmpty().withMessage('Content is required').bail()
        .isLength({ min: 5 }).withMessage('Content must be at least 5 characters long').bail()
        .trim()
];

module.exports.putPostValidator = [
    body('title')
        .not().isEmpty().withMessage('Title is required').bail()
        .isLength({ min: 5 }).withMessage('Title must be at least 5 characters long').bail()
        .trim(),
    body('content')
        .not().isEmpty().withMessage('Content is required').bail()
        .isLength({ min: 5 }).withMessage('Content must be at least 5 characters long').bail()
        .trim()
];