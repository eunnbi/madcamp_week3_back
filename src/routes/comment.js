const router = require('express').Router();
const User = require('../schema/user');
const Avatar = require('../schema/avatar');
const Comment = require('../schema/comment');
const DonatedCherry = require('../schema/donatedCherry');
const Furniture = require('../schema/furniture');
const Room = require('../schema/room');
const RoomFurniture = require('../schema/roomFurniture');
const mongoose = require('mongoose');

// roodId에 해당하는 comment 반환하기, 확인 완료
router.post('/getComment', async (req, res) => {
    const { roomId } = req.body;
    try {
        // const comments = await Comment.find({ roomId });
        const comments = await Comment.find({ roomId }).sort({ createdAt: -1 });
        let result = [];
        for(let i=0 ; i<comments.length ; i++) {
            const commentContent = comments[i].content;
            const author = await User.findById(comments[i].authorId);
            result.unshift({
                authorName : author.name,
                content : commentContent
            })
        }
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: 'An error occurred while fetching the comments.' });
    }
});

// comment 추가하기, 확인 완료
router.post('/add', async (req, res) => {
    const { roomId, authorId, content } = req.body;
    try {
        const newComment = new Comment({roomId, authorId, content});
        newComment.save();
        res.json(newComment);
    } catch (err) {
        res.status(500).json({ error: 'An error occurred while fetching the comments.' });
    }
});

module.exports = router;