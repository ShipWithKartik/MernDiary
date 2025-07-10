const {errorHandler} = require('./error');
const JWT = require('jsonwebtoken');

const verifyToken = (req,res,next)=>{
    
    // Debug logging
    console.log('=== verifyToken Debug ===');
    console.log('All cookies:', req.cookies);
    console.log('Headers:', req.headers);
    console.log('Origin:', req.headers.origin);
    console.log('========================');

    const token = req.cookies.access_token;

    if(!token) {
        console.log('No token found in cookies');
        return next(errorHandler(401,'Unauthorized - No token provided'));
    }

    console.log('Token found:', token.substring(0, 20) + '...');

    JWT.verify(token,process.env.JWT_SECRET,(error,user)=>{
        if(error) {
            console.log('JWT verification error:', error.message);
            return next(errorHandler(401,"Unauthorized - Invalid token"));
        }

        console.log('Token verified successfully for user:', user.id);
        req.user = user;
        next();
    });
}

module.exports = {
    verifyToken
}