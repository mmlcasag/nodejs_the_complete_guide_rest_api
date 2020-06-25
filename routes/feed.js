const express = require('express');

const feedController = require('../controllers/feed');
const feedValidator = require('../validators/feed');

const router = express.Router();

router.get('/posts', feedController.getPosts);
router.post('/post', feedValidator.postPostValidator, feedController.postPost);
router.get('/post/:postId', feedController.getPost);
router.put('/post/:postId', feedValidator.putPostValidator, feedController.putPost);

module.exports = router;