const User = require('../models/userModels');
const { errorHandler } = require('../utils/error');

async function getUser(req,res,next){

    const userId = req.user.id;

    const validUser = await User.findOne({_id:userId});

    if(!validUser)
        return next(errorHandler(401,"Unauthorized"));

    const {password:pass , ...rest} = validUser._doc;

    res.status(200).json(rest);
}

module.exports = {
    getUser
}