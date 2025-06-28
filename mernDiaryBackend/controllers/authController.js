const bcryptjs = require('bcryptjs');
const User = require('../models/userModels');
const { errorHandler } = require('../utils/error');

async function signup(req,res,next){

    const {username , email , password} = req.body;

    if(!username || !email || !password){

        return next(errorHandler(400,'All Fields are required'));
        // Status code 400 -: For bad request
    }


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


module.exports = {
    signup
}