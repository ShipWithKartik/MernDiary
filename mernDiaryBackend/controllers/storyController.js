const Story = require("../models/storyModel");
const { errorHandler } = require("../utils/error");
const path = require('path');
const fs = require('fs');


async function addStory(req,res,next){

    const {title,story,visitedLocation,imageUrl,visitedDate} = req.body;

    const userId = req.user.id

    if(!title || !story || !visitedLocation || !visitedDate){
        return next(errorHandler(400,'All Fields are Required'));

    }

    const placeholderImageUrl = `http://localhost:3000/assets/placeholderImage.png`;

    const parsedVisitedDate = new Date(parseInt(visitedDate));
    // From frontend dates are often sent as : Unix Timestamps (milliseconds) in String representation 
    // parseInt() converts the string to an integer and new Date() creates a JS Date Object

    try {
        const newStory = new Story({
            title,
            story,
            visitedLocation,
            userId,
            imageUrl:imageUrl || placeholderImageUrl,
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

        // Multer adds this file property to request Object , which contains all the file metadata

        let imageUrl = '';
        if(!req.file)
            imageUrl = `http://localhost:3000/assets/placeholderImage.png`;
        else
            imageUrl = `http://localhost:3000/uploads/${req.file.filename}`;

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
        // Calls the OS unlink() system call , which returns a Promise that resolves when deletion (unlinking) completes or Throws an error if file doesn't exist or permission denied

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

    if(!title || !story || !visitedDate || !visitedLocation){
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


async function updateIsFavourite(req,res,next){
    const id = req.params.id;
    const {isFavorite} = req.body;

    const userId = req.user.id;

    try{
        const story = await Story.findOne({_id:id,userId:userId});

        if(!story){
            return next(errorHandler(404,'Story not Found'));
        }

        story.isFavorite = isFavorite;

        await story.save();

        res.status(200).json({updatedStory:story})
    }catch(error){
        next(error);
    }
}

async function searchStory(req,res,next){
    const {query} = req.query;
    const userId = req.user.id;

    if(!query){
        return next(errorHandler(404,'Query is required'));
    }

    try{
        const searchResults = await Story.find({userId:userId , $or: [

            {title: {$regex: query, $options: 'i'}}, 

            {story: {$regex: query, $options: 'i'}},

            {visitedLocation: {$regex: query, $options: 'i'}} 
        ]}).sort({isFavorite: -1});
        // This code performs a search query on the story collection in MongoDB for a specific userId and tries to find all those documents where any of the fields - title , story or visitedLocation match the query string in a case-insensitive manner.
        // $or :[...] is a MongoDB logical operator that means if any of the conditions inside the array match, the document will be included in the results.
        // $regex enables partial text match (like SQL LIKE operator)
        // $options: 'i' makes the regex case-insensitive

        res.status(200).json({
            searchResults: searchResults
        });
    }catch(error){
        next(error);
    }

}

async function filterStory(req, res, next) {
    const { startDate, endDate } = req.query;
    const userId = req.user.id;

    // Add validation for required parameters
    if (!startDate || !endDate) {
        return next(errorHandler(400, 'Both startDate and endDate are required'));
    }

    try {
        const start = new Date(parseInt(startDate));
        const end = new Date(parseInt(endDate));
        // Convert the startDate and endDate strings to Date objects
        
        // Validate the dates
        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            return next(errorHandler(400, 'Invalid date format'));
        }

        // Set start to beginning of day and end to end of day for better range matching
        start.setUTCHours(0, 0, 0, 0);
        end.setUTCHours(23, 59, 59, 999);

        console.log('Filter dates:', { 
            start: start.toISOString(), 
            end: end.toISOString(),
            userId: userId 
        });

        const filterStory = await Story.find({
            userId: userId,
            visitedDate: {
                $gte: start, // Greater than or equal to start date
                $lte: end // Less than or equal to end date
            }
        }).sort({ isFavorite: -1 });
        // $gte and $lte are MongoDB operators that mean "greater than or equal to" and "less than or equal to" respectively

        console.log('Found stories:', filterStory.length);

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
}

/*
Using both storyId and userId is a critical security measure . Here's why:
Problem : Any authenticated user can edit/delete ANY story if they know the story ID!

Using both storyId and userId (for editStory , deleteStory)
Ensures that :
-> User can edit / delete their OWN stories only 
-> Even if someone knows a story ID , they can't modify it unless they own it
*/



/*
Express automatically parses query parameters :
Everything after ? becomes req.query

next() is a callback function that passes control to the next middleware in the stack

next() : Continue to next middleware (normal flow)
next(error) : Skips to error handling middleware 
*/
