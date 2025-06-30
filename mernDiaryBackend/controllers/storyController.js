const Story = require("../models/storyModel");
const { errorHandler } = require("../utils/error");
const path = require('path');
const fs = require('fs');


async function addStory(req,res,next){

    const {title,story,visitedLocation,imageUrl,visitedDate} = req.body;

    const userId = req.user.id

    if(!title || !story || !visitedLocation || !visitedDate || !imageUrl){
        return next(errorHandler(400,'All fields are required'));

    }

    const parsedVisitedDate = new Date(parseInt(visitedDate));

    try {
        const newStory = new Story({
            title,
            story,
            visitedLocation,
            userId,
            imageUrl,
            visitedDate:parsedVisitedDate
        });

        await newStory.save(); 
        res.status(201).json({
            story:newStory,
            message:'Successfully added',
        })
    } catch (error) {
        next(error);
    }

}


async function getStory(req,res,next){

    const userId = req.user.id;

    try{
        const stories = await Story.find({userId}).sort({
            isFavorite:-1,
        });
        res.status(200).json({
            stories:stories
        });
    }catch(error){
        next(error);
    }

}


async function imageUpload(req,res,next){

    try{

        if(!req.file){
            return next(errorHandler(400,'No Image Uploaded'));
        }

        const imageUrl = `http://localhost:3000/uploads/${req.file.filename}`;

        res.status(201).json({imageUrl});

    }catch(error){
        next(error);
    }
}

async function deleteImage(req,res,next){

    const {imageUrl} = req.query;
    // req.query is an object that contains the URL query parameters , suppose the client calls this endpoint : DELETE /delete-image?imageUrl=http://example.com/uploads/photo.jpg 
    // Then req.query = {imageUrl:'https://example.com/uploads/photo.jpg}

    if(!imageUrl){
        return next(errorHandler(400,'imageUrl parameter is required!'));
    }

    try{

        const filename = path.basename(imageUrl);
        // Extracts the filename from a full URL or path . Eg-: photo.jpg

        const filePath = path.join(__dirname, '..', 'uploads', filename);
        // Constructs the absolute path to the file on server 

        if(!fs.existsSync(filePath)){
            return next(errorHandler(404,"File not Found"));
        }

        await fs.promises.unlink(filePath);
        // Asynchronously deletes (unlinks) the file from the filesystem . Unlink is the method used to delete files.

        res.status(200).json({message:'Image deleted successfully!'});
    }
    catch(error){
        next(error);
    }

}


async function editStory(req,res,next){
    const id = req.params.id;

    const {title , story , visitedLocation , imageUrl , visitedDate} = req.body;

    const userId = req.user.id;

    if(!title || !story || !visitedDate || !imageUrl || !visitedLocation){
        return next(errorHandler(400,'All Fields are required'));
    }

    const parsedVisitedDate = new Date(parseInt(visitedDate));

    try{

        const editStory = await Story.findOne({_id:id,userId:userId});

        if(!editStory)
            next(errorHandler(404,"Story not found"));

        const placeholderImageUrl = `http://localhost:3000/assets/placeholderImage.png`;

        editStory.title = title;
        editStory.story = story;
        editStory.visitedLocation = visitedLocation;
        editStory.imageUrl = imageUrl || placeholderImageUrl;
        editStory.visitedDate = parsedVisitedDate;

        await editStory.save();

        res.status(200).json({
            editStory:editStory,
            message:'Story Edited Succesfully!'
        })
    }
    catch(error){
        next(error);
    }
}


async function deleteStory(req,res,next){
    const id = req.params.id;
    const userId = req.user.id;

    try{
        const deleteStory = await Story.findOne({_id:id,userId:userId});

        if(!deleteStory){
            next(errorHandler(404,'Travel Story not Found'));
        }

        await Story.deleteOne({_id:id,userId:userId});

        // Extract the filename from imageUrl
        const imageUrl = deleteStory.imageUrl;
        const filename = path.basename(imageUrl);

        // absolute path to the file on server
        const filePath = path.join(__dirname,'..','uploads',filename);

        if(!fs.existsSync(filePath))
            return next(errorHandler(404,"Image Not Found"));

        await fs.promises.unlink(filePath);

        res.status(200).json({message:'Story deleted Successfully'});

    }
    catch(error){
        next(error);
    }
}

module.exports = {
    addStory,
    getStory,
    imageUpload,
    deleteImage,
    editStory,
    deleteStory
}