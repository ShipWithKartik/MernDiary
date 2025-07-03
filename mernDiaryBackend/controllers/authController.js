const bcryptjs = require('bcryptjs');
const User = require('../models/userModels');
const { errorHandler } = require('../utils/error');
const JWT = require('jsonwebtoken');

async function signup(req,res,next){

    const {username , email , password} = req.body;

    if(!username || !email || !password){

        return next(errorHandler(400,'All Fields are required'));
        // Status code 400 -: For bad request
    }


    // check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
        return next(errorHandler(400, 'User Already Exists'));
    }
    // If user already exists, return error with status code 400 and message 'User Already Exists'

    
    const hashedPassword = bcryptjs.hashSync(password,10);
    // 10 is the salt rounds, salt rounds define how complex (and time consuming) the hashing process is.The number of rounds is an exponent of 2 , 10 rounds means 2^10 = 1024 internal iterations.Salt is just an random string added to password before hashing

    // bcryptjs.hashSync is a synchronous function that hashes the password


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
        // Mongoose document has extra methods and properties ._doc gives you just raw data 

        res.status(200).cookie('access_token',token,{
            httpOnly:true,

        }).json(rest);
        // Browsers stores cookie and Javascript can access it using document.cookie . With httpOnly:true JS cannot access it and Browser still sends it automatically 

        // Login response gives you both: 1) HTTP-Only cookie with minimal token (user ID) 
        // 2) JSON response with full user data , frontend stores user data in Redux store or Context API , Frontend uses stored user data for UI
         
    }catch(error){
        next(errorHandler(error));
    }

}


module.exports = {
    signup,
    signin
}