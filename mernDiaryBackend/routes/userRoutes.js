const express = require('express');
const router = express.Router();
const {verifyToken} = require('../utils/verifyUsers');
const {getUser} = require('../controllers/userController');

router.get('/getusers',verifyToken,getUser);

module.exports = router;
