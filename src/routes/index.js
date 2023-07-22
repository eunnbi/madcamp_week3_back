const express = require('express');
const router = express.Router();

const test = require("./test");

const userRouter = require('./user');
const avatarRouter = require('./avatar');
const commentRouter = require('./comment');
const cherryRouter = require('./cherry');
const furnitureRouter = require('./furniture');
const roomRouter = require('./room');

router.use('/', test);

router.use('/user',userRouter);
router.use('/avatar', avatarRouter);
router.use('/comment', commentRouter);
router.use('/cherry', cherryRouter);
router.use('/furniture', furnitureRouter);
router.use('/room', roomRouter);



module.exports = router;