const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const user = new Schema({
    name: {
        required: true,
        type: String,
        unique: true
    },
    cherry: {
        required: true,
        default: 100,
        type: Number
    },
    myFurnitureList: {
        required: true,
        default: [],
        type: [Schema.Types.ObjectId]
    },
    myAvatarList: {
        required: true,
        default: [],
        type: [Schema.Types.ObjectId]
    }
})

const User = mongoose.model('User', user);
module.exports = User;