const router = require('express').Router();
const {addStory,getStory,imageUpload} = require('../controllers/storyController');
const {verifyToken} = require('../utils/verifyUsers');
const upload = require('../multer');


router.post('/add',verifyToken,addStory);
router.get('/get-all',verifyToken,getStory);
router.post('/image-upload',upload.single('image'),imageUpload);
 
module.exports = router;