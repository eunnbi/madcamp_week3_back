const router = require('express').Router();
const User = require('../schema/user');
const Avatar = require('../schema/avatar');
const Comment = require('../schema/comment');
const DonatedCherry = require('../schema/donatedCherry');
const Furniture = require('../schema/furniture');
const Room = require('../schema/room');
const RoomFurniture = require('../schema/roomFurniture');
const mongoose = require('mongoose');

// 이름이 중복되는지 확인, 확인 완료
router.post('/checkDuplicate', async (req, res) => {
    const { name } = req.body;
    try {
        const existingUser = await User.findOne({ name });
        res.json({ exists: !!existingUser });
    } catch (err) {
        res.status(500).json({ error: 'An error occurred while checking the user.' });
    }
});

// 유저 추가, 확인 완료
router.post('/add', async (req, res) => {
    const { name } = req.body;
    console.log(name);
    const cherry = 100;
    const myFurnitureList = [];
    const myAvatarList = [];
    const avatarName = "평?범한 넙죽이"
    const allAvatar = await Avatar.findOne({name: avatarName});
    console.log(allAvatar.length);
    const defaultAvatar = allAvatar.id;
    myAvatarList.push(defaultAvatar);
    console.log(defaultAvatar);
    try {
        const tempString = '안녕!';
        const newUser = new User({ name, cherry, myFurnitureList, myAvatarList, currentAvatar : defaultAvatar });
        const newUserId = newUser.id;
        const newRoom = new Room({userId : newUserId, avatarId : defaultAvatar, greeting : tempString}); // 수정이 필요함
        await newRoom.save();
        const savedUser = await newUser.save();
        res.json(savedUser);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'An error occurred while adding the user.' });
    }
});

// 이름을 통해 유저 객체 얻기, 완료
router.post('/getUser', async (req, res) => {
    const {name} = req.body;
    try {
        const user = await User.findOne({ name });
        if (user) {
            res.json(user);
        } else {
            res.status(400).json({ message: 'User not found.' });
        }
    } catch (err) {
        res.status(500).json({ error: 'An error occurred while fetching the user.' });
    }
});

// 랜덤 유저 반환, 완료
router.get('/random', async (req, res) => {
    try {
        const count = await User.countDocuments();
        const randomIndex = Math.floor(Math.random() * count);

        const randomUser = await User.findOne().skip(randomIndex);
        if (randomUser) {
            res.json(randomUser);
        } else {
            res.json({ message: 'No users found.' });
        }
    } catch (err) {
        res.status(500).json({ error: 'An error occurred while fetching the random user.' });
    }
});

module.exports = router;