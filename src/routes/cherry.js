const router = require('express').Router();
const User = require('../schema/user');
const Avatar = require('../schema/avatar');
const Comment = require('../schema/comment');
const DonatedCherry = require('../schema/donatedCherry');
const Furniture = require('../schema/furniture');
const Room = require('../schema/room');
const RoomFurniture = require('../schema/roomFurniture');
const mongoose = require('mongoose');

// 체리 순위 가져오기, 확인 완료
router.post('/getRank', async (req, res) => {
    const {userId} = req.body;
    try {
        const donatedCherry = await DonatedCherry.find({userId});
        let result = [];
        for(let i=0 ; i<donatedCherry.length ; i++) {
            const sponsorId = donatedCherry[i].sponsorId;
            const cherry = donatedCherry[i].cherry;
            const sponsorUser = await User.findById(sponsorId)
            result.push({
                sponsorName : sponsorUser.name,
                cherry : cherry
            })
        }
        result.sort((a, b) => b.cherry - a.cherry);
        res.json(result);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'An error occurred while fetching the comments.' });
    }
});

// 체리 기부, 확인 완료
router.post('/addCherry', async (req, res) => {
    const {userId, sponsorId, cherry} = req.body;
    const donatedCherry = await DonatedCherry.findOne({userId, sponsorId});
    try {
        const user = await User.findById(userId);

        if(donatedCherry) {
            donatedCherry.cherry += cherry;
            await donatedCherry.save();
        } else {
            // 첫 후원
            const newDonatedCherry = new DonatedCherry({ userId, sponsorId, cherry });
            await newDonatedCherry.save();
        }

        user.cherry += cherry;

        await user.save();
        await sponsor.save();
        
        res.status(200).json(donatedCherry);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'An error occurred while fetching the comments.' });
    }
});

module.exports = router;