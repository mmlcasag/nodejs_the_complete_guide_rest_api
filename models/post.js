const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
    title: {
        Type: String,
        required: true
    },
    content: {
        Type: String,
        required: true
    },
    imageUrl: {
        Type: String,
        required: true
    },
    creator: {
        Type: Object,
        required: true
    }  
},
{ timestamps: true } // automatically creates and manages createdAt and updatedAt attributes
);

module.exports = mongoose.model('Post', postSchema);