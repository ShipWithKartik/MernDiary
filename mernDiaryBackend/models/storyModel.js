const mongoose = require('mongoose');

const storySchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    story:{
        type:String,
        required:true
    },
    visitedLocation:{
        type:[String],
        default:[]
    },
    isFavorite:{
        type:Boolean,
        default:false
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    imageUrl:{
        type:String,
    },
    visitedDate:{
        type:Date,
        required:true
    }
},{timestamps:true});


const Story = mongoose.model('story',storySchema);

module.exports = Story;