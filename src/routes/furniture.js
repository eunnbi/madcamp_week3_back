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
    const { name, price, imagePath, category } = req.body;
    try {
        const newFurniture = new Furniture({name, price, imagePath, category});
        const savedFurniture = await newFurniture.save();
        res.json(savedFurniture);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'An error occurred while adding the user.' });
    }
});

// 가구들 추가하기
router.post('/adds', async (req, res) => {
    const { furnitures } = req.body;
    try {
        const newFurniture = await Furniture.insertMany(furnitures);
        // const savedFurniture = await newFurniture.save();
        res.json(newFurniture);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'An error occurred while adding the user.' });
    }
});

// 구매하지 않은 가구 불러오기
router.post('/getFurniture', async (req, res) => {
    const {userId, category} = req.body;
    try {
        const me = await User.findById(userId);
        const allFurniture = await Furniture.find({category});
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
    const {userId, category} = req.body;
    try {
        const me = await User.findById(userId);
        const allFurniture = await Furniture.find({category});
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
        } else {
            me.cherry -= furnitureToBuy.price;
            me.myFurnitureList.push(furnitureId);
            await me.save();

            res.status(200).json();
        }
        
    } catch (err) {
        res.status(500).json({ error: 'An error occurred while fetching the comments.' });
    }
});

// 가구 배치 정보 저장하기
router.post('/saveFurniturePosition', async (req, res) => {
    const {roomId, furnitureId,roomFurnitureId, x,y,z} = req.body;
    
    console.log(roomFurnitureId);

    const objectId = new mongoose.Types.ObjectId(roomFurnitureId)

    try {
        const temp = await RoomFurniture.findById(objectId);
        if(temp) {
            const updatedRoomFurniture = await RoomFurniture.findByIdAndUpdate(
                objectId , // 필터 조건으로 해당 룸 가구 찾기
                { x, y, z }, // 업데이트할 값들
                { new: true } // 업데이트 이후의 문서 반환 (기본값은 false이며 업데이트 이전 문서를 반환함)
            );
            res.status(200).json(updatedRoomFurniture);
        } else {
            const newRoomFurniture = new RoomFurniture({ furnitureId, roomId, x, y, z });
            const savedRoomFurniture = await newRoomFurniture.save();
            res.status(200).json(savedRoomFurniture);
        }
        

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'An error occurred while fetching the comments.' });
    }
});

// 가구 배치정보 삭제하기
router.post('/deleteFurniturePosition', async (req, res) => {
    const { roomFurnitureId } = req.body;
    try {
        // roomFurnitureId에 해당하는 룸 가구를 삭제
        const deletedRoomFurniture = await RoomFurniture.findByIdAndRemove(roomFurnitureId);
        if (!deletedRoomFurniture) {
            return res.status(404).json({ error: 'Room furniture not found.' });
        }
        res.json(deletedRoomFurniture);
    } catch (err) {
        res.status(500).json({ error: 'An error occurred while deleting the furniture.' });
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
            const roomFurnitureId = roomFurnitures[i]._id;
            const x = roomFurnitures[i].x;
            const y = roomFurnitures[i].y;
            const z = roomFurnitures[i].z;
            result.push({
                roomFurnitureId : roomFurnitureId,
                furnitureId : furnitureId,
                imagePath : furniture.imagePath,
                x : x,
                y : y,
                z : z
            })
        }

        result.sort((a, b) => a.z - b.z);


        res.json(result);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'An error occurred while fetching the comments.' });
    }
});

module.exports = router;