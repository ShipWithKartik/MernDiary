const Story = require("../models/storyModel");
const { errorHandler } = require("../utils/error");
const cloudinary = require('cloudinary').v2;

// Helper function to extract public_id from Cloudinary URL
function extractPublicId(imageUrl) {
    // Example URL: https://res.cloudinary.com/dsougohca/image/upload/v1234567890/travel-stories/story-123456789.jpg
    // We need to extract: travel-stories/story-123456789
    
    if (!imageUrl || !imageUrl.includes('cloudinary.com')) {
        return null;
    }
    
    const parts = imageUrl.split('/');
    const uploadIndex = parts.indexOf('upload');
    if (uploadIndex === -1) return null;
    
    // Skip 'upload' and version (v1234567890)
    const publicIdParts = parts.slice(uploadIndex + 2);
    const publicIdWithExtension = publicIdParts.join('/');
    
    // Remove file extension
    const publicId = publicIdWithExtension.replace(/\.[^/.]+$/, '');
    return publicId;
}

async function addStory(req, res, next) {
    const { title, story, visitedLocation, imageUrl, visitedDate } = req.body;
    const userId = req.user.id;

    if (!title || !story || !visitedLocation || !visitedDate) {
        return next(errorHandler(400, 'All Fields are Required'));
    }

    // Use a placeholder image URL (you can host this on Cloudinary too)
    const placeholderImageUrl = `https://res.cloudinary.com/dsougohca/image/upload/v1/travel-stories/placeholder-image.png`;

    const parsedVisitedDate = new Date(parseInt(visitedDate));

    try {
        const newStory = new Story({
            title,
            story,
            visitedLocation,
            userId,
            imageUrl: imageUrl || placeholderImageUrl,
            visitedDate: parsedVisitedDate
        });

        await newStory.save();
        res.status(201).json({
            story: newStory,
            message: 'Successfully added',
        });
    } catch (error) {
        next(error);
    }
}

async function getStory(req, res, next) {
    const userId = req.user.id;

    try {
        const stories = await Story.find({ userId }).sort({
            isFavorite: -1,
        });
        res.status(200).json({
            stories: stories
        });
    } catch (error) {
        next(error);
    }
}

async function imageUpload(req, res, next) {
    try {
        // Multer with Cloudinary storage automatically uploads to Cloudinary
        // req.file now contains Cloudinary information instead of local file info
        
        let imageUrl = '';
        if (!req.file) {
            imageUrl = `https://res.cloudinary.com/dsougohca/image/upload/v1/travel-stories/placeholder-image.png`;
        } else {
            // Cloudinary URL is available in req.file.path
            imageUrl = req.file.path;
        }

        res.status(201).json({ imageUrl });

    } catch (error) {
        next(error);
    }
}

async function deleteImage(req, res, next) {
    const { imageUrl } = req.query;

    if (!imageUrl) {
        return next(errorHandler(400, 'imageUrl parameter is required!'));
    }

    try {
        // Extract public_id from Cloudinary URL
        const publicId = extractPublicId(imageUrl);
        
        if (!publicId) {
            return next(errorHandler(400, 'Invalid Cloudinary URL'));
        }

        // Don't delete placeholder image
        if (publicId.includes('placeholder-image')) {
            return res.status(200).json({ message: 'Placeholder image cannot be deleted' });
        }

        // Delete from Cloudinary
        const result = await cloudinary.uploader.destroy(publicId);
        
        if (result.result === 'ok') {
            res.status(200).json({ message: 'Image deleted successfully!' });
        } else {
            return next(errorHandler(404, 'Image not found or already deleted'));
        }

    } catch (error) {
        console.error('Cloudinary deletion error:', error);
        next(error);
    }
}

async function editStory(req, res, next) {
    const id = req.params.id;
    const { title, story, visitedLocation, imageUrl, visitedDate } = req.body;
    const userId = req.user.id;

    if (!title || !story || !visitedDate || !visitedLocation) {
        return next(errorHandler(400, 'All Fields are required'));
    }

    const parsedVisitedDate = new Date(parseInt(visitedDate));

    try {
        const editStory = await Story.findOne({ _id: id, userId: userId });

        if (!editStory) {
            return next(errorHandler(404, "Story not found"));
        }

        const placeholderImageUrl = `https://res.cloudinary.com/dsougohca/image/upload/v1/travel-stories/placeholder-image.png`;

        editStory.title = title;
        editStory.story = story;
        editStory.visitedLocation = visitedLocation;
        if (imageUrl == '' || imageUrl == null) {
            editStory.imageUrl = placeholderImageUrl;
        } else {
            editStory.imageUrl = imageUrl;
        }
        editStory.visitedDate = parsedVisitedDate;

        await editStory.save();

        res.status(200).json({
            editStory: editStory,
            message: 'Story Edited Successfully!'
        });
    } catch (error) {
        next(error);
    }
}

async function deleteStory(req, res, next) {
    const id = req.params.id;
    const userId = req.user.id;

    try {
        const deleteStory = await Story.findOne({ _id: id, userId: userId });

        if (!deleteStory) {
            return next(errorHandler(404, 'Travel Story not Found'));
        }

        await Story.deleteOne({ _id: id, userId: userId });

        // Handle image deletion from Cloudinary
        const imageUrl = deleteStory.imageUrl;
        const placeholderImageUrl = `https://res.cloudinary.com/dsougohca/image/upload/v1/travel-stories/placeholder-image.png`;

        if (imageUrl && imageUrl !== placeholderImageUrl) {
            const publicId = extractPublicId(imageUrl);
            
            if (publicId && !publicId.includes('placeholder-image')) {
                try {
                    await cloudinary.uploader.destroy(publicId);
                    console.log(`Image deleted from Cloudinary: ${publicId}`);
                } catch (cloudinaryError) {
                    console.error('Error deleting image from Cloudinary:', cloudinaryError);
                    // Don't fail the story deletion if image deletion fails
                }
            }
        }

        res.status(200).json({ message: 'Story deleted Successfully' });

    } catch (error) {
        next(error);
    }
}

async function updateIsFavourite(req, res, next) {
    const id = req.params.id;
    const { isFavorite } = req.body;
    const userId = req.user.id;

    try {
        const story = await Story.findOne({ _id: id, userId: userId });

        if (!story) {
            return next(errorHandler(404, 'Story not Found'));
        }

        story.isFavorite = isFavorite;
        await story.save();

        res.status(200).json({ updatedStory: story });
    } catch (error) {
        next(error);
    }
}

async function searchStory(req, res, next) {
    const { query } = req.query;
    const userId = req.user.id;

    if (!query) {
        return next(errorHandler(400, 'Query is required'));
    }

    try {
        const searchResults = await Story.find({
            userId: userId,
            $or: [
                { title: { $regex: query, $options: 'i' } },
                { story: { $regex: query, $options: 'i' } },
                { visitedLocation: { $regex: query, $options: 'i' } }
            ]
        }).sort({ isFavorite: -1 });

        res.status(200).json({
            searchResults: searchResults
        });
    } catch (error) {
        next(error);
    }
}

async function filterStory(req, res, next) {
    const { startDate, endDate } = req.query;
    const userId = req.user.id;

    if (!startDate || !endDate) {
        return next(errorHandler(400, 'Both startDate and endDate are required'));
    }

    try {
        const start = new Date(parseInt(startDate));
        const end = new Date(parseInt(endDate));

        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            return next(errorHandler(400, 'Invalid date format'));
        }

        start.setUTCHours(0, 0, 0, 0);
        end.setUTCHours(23, 59, 59, 999);

        const filterStory = await Story.find({
            userId: userId,
            visitedDate: {
                $gte: start,
                $lte: end
            }
        }).sort({ isFavorite: -1 });

        res.status(200).json({
            filteredStories: filterStory
        });

    } catch (error) {
        console.error('Filter error:', error);
        next(error);
    }
}

module.exports = {
    addStory,
    getStory,
    imageUpload,
    deleteImage,
    editStory,
    deleteStory,
    updateIsFavourite,
    searchStory,
    filterStory
};

/*
Key Changes Made for Cloudinary Integration:

1. Replaced all localhost URLs with Cloudinary URLs
2. Added extractPublicId() helper function to extract public_id from Cloudinary URLs
3. Updated imageUpload() to use req.file.path (Cloudinary URL) instead of local filename
4. Updated deleteImage() to use cloudinary.uploader.destroy() instead of fs.unlink()
5. Updated deleteStory() to clean up images from Cloudinary
6. Added error handling for Cloudinary operations
7. Protected placeholder image from deletion
8. Removed fs and path dependencies (no longer needed)
*/