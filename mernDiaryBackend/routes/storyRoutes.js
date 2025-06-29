const router = require('express').Router();
const {addStory,getStory} = require('../controllers/storyController');
const {verifyToken} = require('../utils/verifyUsers');


router.post('/add',verifyToken,addStory);
router.get('/get-all',verifyToken,getStory);

module.exports = router;