const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const roomFurniture = new Schema({
    furnitureId: {
        required: true,
        type: Schema.Types.ObjectId
    },
    roomId: {
        required: true,
        type: Schema.Types.ObjectId
    },
    x: {
        required: true,
        type: Number
    },
    y: {
        required: true,
        type: Number
    },
    z: {
        required: true,
        type: Number
    }
})


const RoomFurniture = mongoose.model('RoomFurniture', roomFurniture);
module.exports = RoomFurniture;