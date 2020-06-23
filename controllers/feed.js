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
    const title = req.body.title;
    const content = req.body.content;
    
    // create post in the database
    res.status(201).json({
        message: 'Post created successfully',
        post: { 
            id: new Date().toISOString(),
            title: title,
            content: content
        }
    });
}