const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
dotenv.config();


mongoose
.connect(process.env.MONGO_URI)
    .then(()=>{
        console.log('DataBase Mongo-Atlas Connected :)')
    })
    .catch((error)=>{
        console.log('Database is connected :(',error);
    })

app.listen(3000,()=>{
    console.log("Server is running on port 3000!")
});