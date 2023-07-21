const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const comment = new Schema({
    roomId: {
        required: true,
        type: Schema.Types.ObjectId
    },
    authorId: {
        required: true,
        type: Schema.Types.ObjectId
    },
    content: {
        required: true,
        type: String
    }
})


const Comment = mongoose.model('Comment', comment);
module.exports = Comment;