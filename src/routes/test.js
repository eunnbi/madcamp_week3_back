const express = require('express')
const router = express.Router();

router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'connect'
  })
});

module.exports = router;