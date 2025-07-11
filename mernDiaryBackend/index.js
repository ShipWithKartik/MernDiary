const express = require('express');
const app = express();
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors'); 

dotenv.config();
const PORT = process.env.PORT || 3000;

const authRouters = require('./routes/authRoutes.js');
const userRouter = require('./routes/userRoutes.js');
const storyRouter = require('./routes/storyRoutes.js');

// Database connection
mongoose
.connect(process.env.MONGO_URI)
    .then(()=>{
        console.log('DataBase Mongo-Atlas Connected :)')
    })
    .catch((error)=>{
        console.log('Database is not connected :(',error);
    })

// CORS configuration for both development and production
const allowedOrigins = [
    'http://localhost:5173', // local frontend (Vite default)
    'http://localhost:3000', // Alternative local frontend
    'http://localhost:3001', // Another alternative
    'https://mern-diary.vercel.app'
];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true, // Allow cookies and authorization headers to be sent with requests
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
})); 

app.use(cookieParser());
app.use(express.json());

app.use('/api/story',storyRouter);
app.use('/api/auth',authRouters);
app.use('/api/user',userRouter);

// Basic route to test if server is running
app.get('/', (req, res) => {
    res.json({ 
        message: 'Backend API is running successfully!',
        timestamp: new Date().toISOString(),
        port: PORT
    });
});

// Serve static files 
app.use('/uploads',express.static(path.join(__dirname,'uploads')));

// MIDDLEWARE FIRST - Parse requests before routing 
// ROUTES AFTER - Now req.body will be available 

// Use PORT variable instead of hard-coded 3000
app.listen(PORT,'0.0.0.0',()=>{
    console.log(`Server is running on port ${PORT}!`)
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

// Request reaches controller function , if validation fails --> errorHandler(400,'All Fields are required') . The error Handler function returns a error object 
// next(error) -> Passes error to Express error middleware , Express skips all the remaining route handlers skips all regular middlewares and jumps directly to the error handling middleware

// Regular Middleware : [Request] -> [Middleware 1] -> [Middleware 2] -> [Route Handler] -> [Response] 

// Error Middleware : [Request] -> [Middleware 1] -> [Route Handler: calls next(error)] -> SKIP -> Error Middleware -> Response.