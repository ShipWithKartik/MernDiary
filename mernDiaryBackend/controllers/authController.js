const bcryptjs = require('bcryptjs');
const User = require('../models/userModels');
const { errorHandler } = require('../utils/error');
const JWT = require('jsonwebtoken');

async function signup(req,res,next){

    const {username , email , password} = req.body;

    if(!username || !email || !password){
        return next(errorHandler(400,'All Fields are required'));
    }

    // check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
        return next(errorHandler(400, 'User Already Exists'));
    }
    
    const hashedPassword = bcryptjs.hashSync(password,10);

    const newUser = new User({
        username,
        email,
        password:hashedPassword
    })

    try{
        await newUser.save();
        res.json({message:'signup successfull'});
    }
    catch(error){
        next(error);
    }
}

async function signin(req,res,next){

    const {email , password} = req.body;

    if(!email || !password ||email===''||password===''){
        return next(errorHandler(400,'All Fields are required'));
    }

    try{
        const validUser = await User.findOne({email:email});

        if(!validUser){
            return next(errorHandler(404,'User Not Found'));
        }

        const validPassword = bcryptjs.compareSync(password,validUser.password);

        if(!validPassword)
            return next(errorHandler(400,'Wrong Credentials'));
        
        const token = JWT.sign({id:validUser._id},process.env.JWT_SECRET);

        const {password:pass , ...rest} = validUser._doc;

        // Cross-origin cookie configuration
        const isProduction = process.env.NODE_ENV === 'production';
        
        res.status(200).cookie('access_token', token, {
            httpOnly: true,
            secure: isProduction, // Only HTTPS in production
            sameSite: isProduction ? 'none' : 'lax', // Critical for cross-origin
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            path: '/' // Available for entire domain
        }).json(rest);
         
    }catch(error){
        next(error);
    }
}

module.exports = {
    signup,
    signin,
}


// changed this file