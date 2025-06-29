const router = require('express').Router();
const {addStory} = require('../controllers/storyController');
const {verifyToken} = require('../utils/verifyUsers');

router.post('/add',verifyToken,addStory);

module.exports = router;