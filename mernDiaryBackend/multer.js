const multer = require('multer');
const path = require('path');


const storage = multer.diskStorage({
    destination:function(req,file,cb){
        return cb(null,'./uploads')
    },
    filename:function(req,file,cb){
        return cb(null,Date.now() + path.extname(file.originalname));
    }
});

// file:The file object representing the uploaded file (includes details like originalname , mimetype , size)
const fileFilter = (req,file,cb)=>{

    if(file.mimetype.startsWith('image/')){
        cb(null,true);
        // Accept file , Multer expects fileFilter to use the callback like this : cb(error,acceptFile) acceptFile can be true or false
    }
    else{
        cb(new Error("Only images are allowed"),false);
    }
}

const upload = multer({storage,fileFilter});
// Initialize multer instance


module.exports = upload;