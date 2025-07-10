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


async function signout(req, res, next) {
    try {
        const isProduction = process.env.NODE_ENV === 'production';
        
        res.clearCookie('access_token', {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? 'none' : 'lax',
            path: '/'
        }).json({ message: 'Signout successful' });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    signout
}