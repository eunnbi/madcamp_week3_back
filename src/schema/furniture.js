const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const furniture = new Schema({
    name: {
        required: true,
        type: String
    },
    price: {
        required: true,
        type: Number
    },
    imagePath: {
        required: true,
        type: String
    },
    category: {
        required: true,
        type: Number
    }
})


const Furniture = mongoose.model('Furniture', furniture);
module.exports = Furniture;