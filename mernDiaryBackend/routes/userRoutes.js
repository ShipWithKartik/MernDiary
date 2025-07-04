const express = require('express');
const router = express.Router();
const {verifyToken} = require('../utils/verifyUsers');
const {signout} = require('../controllers/userController');

router.get('/signout',signout);

module.exports = router;
