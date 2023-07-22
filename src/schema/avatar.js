const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const avatar = new Schema({
    name: {
        required: true,
        type: String
    },
    price: {
        required: true,
        type: Number
    },
    avatarImagePath: {
        required: true,
        type: String
    },
    itemImagePath: {
        required: true,
        type: String
    }
})


const Avatar = mongoose.model('Avatar', avatar);
module.exports = Avatar;