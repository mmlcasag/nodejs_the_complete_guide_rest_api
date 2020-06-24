const express = require('express');

const feedController = require('../controllers/feed');
const feedValidator = require('../validators/feed');

const router = express.Router();

router.get('/posts', feedController.getPosts);
router.get('/post/:postId', feedController.getPost);
router.post('/post', feedValidator.postPostValidator, feedController.postPost);

module.exports = router;