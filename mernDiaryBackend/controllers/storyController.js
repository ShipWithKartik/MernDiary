const Story = require("../models/storyModel");
const { errorHandler } = require("../utils/error");

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

module.exports = {
    addStory,
    getStory,
    imageUpload
}