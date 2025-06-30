const express = require('express');
const app = express();
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const path = require('path');
dotenv.config();

const authRouters = require('./routes/authRoutes.js');
const userRouter = require('./routes/userRoutes.js');
const storyRouter = require('./routes/storyRoutes.js');



mongoose
.connect(process.env.MONGO_URI)
    .then(()=>{
        console.log('DataBase Mongo-Atlas Connected :)')
    })
    .catch((error)=>{
        console.log('Database is not connected :(',error);
    })


app.use(cookieParser());
app.use(express.json());

app.use('/api/story',storyRouter);
app.use('/api/auth',authRouters);
app.use('/api/user',userRouter);

// Serve static files 
app.use('/uploads',express.static(path.join(__dirname,'uploads')));

// MIDDLEWARE FIRST - Parse requests before routing 
// ROUTES AFTER - Now req.body will be available 


app.listen(3000,()=>{
    console.log("Server is running on port 3000!")
});


app.use((error,req,res,next)=>{

    const statusCode = error.statusCode || 500
    const message = error.message || 'Internal Server Error'

    res.status(statusCode).json({
        success:false,
        statusCode,
        message
    })


})
// Request reaches signup controller function , if validation fails --> errorHandler(400,'All Fields are required') . The error Handler function returns a error object 
// next(error) -> Passes error to Express error middleware , Express skips all the remaining route handlers skips all regular middlewares and jumps directly to the error handling middleware

// Regular Middleware : [Request] -> [Middleware 1] -> [Middleware 2] -> [Route Handler] -> [Response] 

// Error Middleware : [Request] -> [Middleware 1] -> [Route Handler: calls next(error)] -> SKIP -> Error Middleware -> Response 
