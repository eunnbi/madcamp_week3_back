const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const donatedCherry = new Schema({
    userId: {
        required: true,
        type: Schema.Types.ObjectId
    },
    sponsorId: {
        required: true,
        type: Schema.Types.ObjectId
    },
    cherry: {
        required: true,
        type: Number
    }
})


const DonatedCherry = mongoose.model('DonatedCherry', donatedCherry);
module.exports = DonatedCherry;