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




module.exports = {
    addStory
}