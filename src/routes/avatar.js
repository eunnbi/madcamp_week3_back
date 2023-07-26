const router = require('express').Router();
const User = require('../schema/user');
const Avatar = require('../schema/avatar');
const Comment = require('../schema/comment');
const DonatedCherry = require('../schema/donatedCherry');
const Furniture = require('../schema/furniture');
const Room = require('../schema/room');
const RoomFurniture = require('../schema/roomFurniture');
const mongoose = require('mongoose');

// 구매하지 않은 avatar 불러오기, 확인 완료
router.post('/getAvatar', async (req, res) => {
    const {userId} = req.body;
    try {
        const me = await User.findById(userId);
        const allAvatar = await Avatar.find();
        let result = [];
        const myAvatar = me.myAvatarList;
        for(let i=0 ; i<allAvatar.length ; i++) {
            if(!myAvatar.includes(allAvatar[i]._id)) {
                result.push(allAvatar[i]);
            }
        }
        
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ error: 'An error occurred while fetching the comments.' });
    }
});

// 내가 구매한 avatar 불러오기, 확인 완료
router.post('/getMyAvatar', async (req, res) => {
    const {userId} = req.body;
    try {
        const me = await User.findById(userId);
        const allAvatar = await Avatar.find();
        let result = [];
        const myAvatarList = me.myAvatarList;
        for(let i=0 ; i<allAvatar.length ; i++) {
            if(myAvatarList.includes(allAvatar[i]._id)) {
                result.push(allAvatar[i]);
            }
        }
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ error: 'An error occurred while fetching the comments.' });
    }
});

// Avatar 구매하기, 확인 완료
router.post('/buyAvatar', async (req, res) => {
    const {userId, avatarId} = req.body;
    try {
        const me = await User.findById(userId);
        const avatarToBuy = await Avatar.findById(avatarId);

        if(me.cherry < avatarToBuy.price) {
            res.status(400).json({ error: 'too expensive.' });
        } else { 
            me.cherry -= avatarToBuy.price;
            me.myAvatarList.push(avatarId);
            await me.save();
    
            res.status(200).json();
        }
    } catch (err) {
        res.status(500).json({ error: 'An error occurred while fetching the comments.' });
    }
});

// 내 아바타 이미지 불러오기, 확인 완료
router.post('/getMyAvatarImagePath', async (req, res) => {
    const {userId} = req.body;
    try {
        const me= await User.findById(userId);
        const myAvatar = await Avatar.findById(me.currentAvatar)

        res.status(200).json({avatarImagePath : myAvatar.avatarImagePath});
    } catch (err) {
        res.status(500).json({ error: 'An error occurred while fetching the comments.' });
    }
});

// 내 아바타 지정, 확인 완료
router.post('/setAvatar', async (req, res) => {
    const { userId, avatarId } = req.body;
    try {
        const me = await User.findById(userId);
        me.currentAvatar = avatarId;
        await me.save();

        res.json();
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'An error occurred while fetching the comments.' });
    }
});

// avatar 추가, 확인 완료
router.post('/add', async (req, res) => {
    const { name, price, avatarImagePath,itemImagePath } = req.body;
    
    try {
        const newUser = new Avatar({ name, price, avatarImagePath, itemImagePath });
        const savedUser = await newUser.save();
        res.json(savedUser);
    } catch (err) {
        res.status(500).json({ error: 'An error occurred while adding the user.' });
    }
});


// 가구들 추가하기
router.post('/adds', async (req, res) => {
    const { avatars } = req.body;
    try {
        const newAvatars = await Avatar.insertMany(avatars);
        // const savedFurniture = await newFurniture.save();
        res.json(newAvatars);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'An error occurred while adding the user.' });
    }
});
module.exports = router;