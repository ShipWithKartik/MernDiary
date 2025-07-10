const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Cloudinary automatically reads CLOUDINARY_URL from environment variables
// No need to manually configure if you have CLOUDINARY_URL set

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'travel-stories', // Creates a folder in your Cloudinary account
        allowed_formats: ['jpg', 'png', 'jpeg', 'gif', 'webp'],
        transformation: [
            { 
                width: 1200, 
                height: 1200, 
                crop: 'limit', // Don't upscale, only downscale if larger
                quality: 'auto', // Automatic quality optimization
                fetch_format: 'auto' // Automatic format optimization (WebP, AVIF, etc.)
            }
        ],
        // Generate unique filename
        public_id: (req, file) => {
            return `story-${Date.now()}-${Math.round(Math.random() * 1E9)}`;
        }
    }
});

// File filter remains the same
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
        // Accept file, Multer expects fileFilter to use the callback like this: cb(error, acceptFile)
    } else {
        cb(new Error("Only images are allowed"), false);
    }
};

const upload = multer({ 
    storage, 
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

module.exports = upload;