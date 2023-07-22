const router = require('express').Router();
const User = require('../schema/user');
const Avatar = require('../schema/avatar');
const Comment = require('../schema/comment');
const DonatedCherry = require('../schema/donatedCherry');
const Furniture = require('../schema/furniture');
const Room = require('../schema/room');
const RoomFurniture = require('../schema/roomFurniture');
const mongoose = require('mongoose');

// 가구 추가하기
router.post('/add', async (req, res) => {
    const { name, price, imagePath } = req.body;
    try {
        const newFurniture = new Furniture({name, price, imagePath});
        const savedFurniture = await newFurniture.save();
        res.json(savedFurniture);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'An error occurred while adding the user.' });
    }
});

// 구매하지 않은 가구 불러오기
router.post('/getFurniture', async (req, res) => {
    const {userId} = req.body;
    try {
        const me = await User.findById(userId);
        const allFurniture = await Furniture.find();
        let result = [];
        const myFurnitureList = me.myFurnitureList;
        for(let i=0 ; i<allFurniture.length ; i++) {
            if(!myFurnitureList.includes(allFurniture[i]._id)) {
                result.push(allFurniture[i]);
            }
        }
        
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ error: 'An error occurred while fetching the comments.' });
    }
});

// 내가 구매한 가구 불러오기
router.post('/getMyFurniture', async (req, res) => {
    const {userId} = req.body;
    try {
        const me = await User.findById(userId);
        const allFurniture = await Furniture.find();
        let result = [];
        const myFurnitureList = me.myFurnitureList;
        for(let i=0 ; i<allFurniture.length ; i++) {
            if(myFurnitureList.includes(allFurniture[i]._id)) {
                result.push(allFurniture[i]);
            }
        }
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ error: 'An error occurred while fetching the comments.' });
    }
});

// 가구 구매하기
router.post('/buyFurniture', async (req, res) => {
    const {userId, furnitureId} = req.body;
    try {
        const me = await User.findById(userId);
        const furnitureToBuy = await Furniture.findById(furnitureId);

        if(me.cherry < furnitureToBuy.price) {
            res.status(400).json({ error: 'too expensive.' });
        }

        me.cherry -= furnitureToBuy.price;
        me.myFurnitureList.push(furnitureId);
        await me.save();

        res.status(200).json();
    } catch (err) {
        res.status(500).json({ error: 'An error occurred while fetching the comments.' });
    }
});

// 가구 배치 정보 저장하기
router.post('/saveFurniturePosition', async (req, res) => {
    const {roomId, furnitureId, x,y,z} = req.body;
    try {
        const newRoomFurniture = new RoomFurniture({ furnitureId, roomId, x, y, z });
        const savedRoomFurniture = await newRoomFurniture.save();
        res.json(savedRoomFurniture);

        res.status(200).json();
    } catch (err) {
        res.status(500).json({ error: 'An error occurred while fetching the comments.' });
    }
});

// 가구 배치 정보 불러오기
router.post('/getFurniturePosition', async (req, res) => {
    const { roomId } = req.body;
    try {
        const roomFurnitures = await RoomFurniture.find({ roomId });
        let result = [];
        for(let i=0 ; i<roomFurnitures.length ; i++) {
            const furnitureId = roomFurnitures[i].furnitureId;
            const furniture = await Furniture.findById(furnitureId);
            result.push({
                imagePath : furniture.imagePath,
                x : x,
                y : y,
                z : z
            })
        }
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: 'An error occurred while fetching the comments.' });
    }
});

module.exports = router;