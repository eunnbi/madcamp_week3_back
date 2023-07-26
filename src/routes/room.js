const router = require('express').Router();
const User = require('../schema/user');
const Avatar = require('../schema/avatar');
const Comment = require('../schema/comment');
const DonatedCherry = require('../schema/donatedCherry');
const Furniture = require('../schema/furniture');
const Room = require('../schema/room');
const RoomFurniture = require('../schema/roomFurniture');
const mongoose = require('mongoose');

// 이름을 통해 room 객체 얻기, 확인 완료
router.post('/getRoom', async (req, res) => {
    const { userId } = req.body;
    try {
        const room = await Room.findOne({ userId });
        if (room) {
            res.json(room);
        } else {
            res.json({ message: 'Room not found.' });
        }
    } catch (err) {
        res.status(500).json({ error: 'An error occurred while fetching the user.' });
    }
});

// 인사말 정보 저장하기
router.post('/setGreeting', async (req, res) => {
    const {roomId, greeting} = req.body;
    try {
        const myRoom = await Room.findByIdAndUpdate(roomId, {greeting}, {new:true});
        res.status(200).json(myRoom);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'An error occurred while fetching the comments.' });
    }
});

module.exports = router;