const {errorHandler} = require('./error');
const JWT = require('jsonwebtoken');


const verifyToken = (req,res,next)=>{

    const token = req.cookies.access_token;

    if(!token)
        return next(errorHandler(401,'Unauthorized'));

    JWT.verify(token,process.env.JWT_SECRET,(error,user)=>{
        if(error)
            return next(errorHandler(401,"Unauthorized"));

        req.user = user;
        // user variable contains the decoded payload from JWT token.This is the original data that was embedded in the token when it was created (signed)

        next();
        // calls the route handler of the current request URL
    });
}

module.exports = {
    verifyToken
}