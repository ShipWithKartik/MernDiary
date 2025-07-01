const router = require('express').Router();
const {addStory,getStory,imageUpload,deleteImage,editStory,deleteStory,updateIsFavourite,searchStory} = require('../controllers/storyController');
const {verifyToken} = require('../utils/verifyUsers');
const upload = require('../multer');


router.post('/add',verifyToken,addStory);

router.get('/get-all',verifyToken,getStory);

router.post('/image-upload',upload.single('image'),imageUpload);

router.delete('/delete-image',deleteImage);

router.post('/edit-story/:id',verifyToken,editStory);

router.delete('/delete-story/:id',verifyToken,deleteStory);

router.put('/update-is-favourite/:id',verifyToken,updateIsFavourite);  

router.get('/search',verifyToken,searchStory);

module.exports = router;


