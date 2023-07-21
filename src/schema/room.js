const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const room = new Schema({
    userId: {
        required: true,
        type: Schema.Types.ObjectId,
        ref: 'User',
        unique: true
    },
    avatarId: {
        required: true,
        type: Schema.Types.ObjectId,
    },
    greeting: {
        type: String
    }
})


const Room = mongoose.model('Room', room);
module.exports = Room;