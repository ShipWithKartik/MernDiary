const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
dotenv.config();

const authRouter = require('./routes/authRoutes.js');

app.use(express.json());
app.use(express.urlencoded({extended:false}));

mongoose
.connect(process.env.MONGO_URI)
    .then(()=>{
        console.log('DataBase Mongo-Atlas Connected :)')
    })
    .catch((error)=>{
        console.log('Database is not connected :(',error);
    })


app.use('/api/auth',authRouter);


app.listen(3000,()=>{
    console.log("Server is running on port 3000!")
});