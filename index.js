const dotenv = require("dotenv")
require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const userrouter = require('./route/user');
const { default: mongoose } = require('mongoose');
const cookieParser = require('cookie-parser');



const app  = express();
const PORT = 3000 || process.env.PORT;

app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'], 
    allowedHeaders: ['Content-Type', 'Authorization'], 
  }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser()); 

mongoose.connect(process.env.MONGODB_URL , {useNewUrlParser: true, useUnifiedTopology: true}).then(() => {
    console.log('Database connected');
})

app.get('/' , (req , res) => {
    res.send('Hello World'); 
})

app.use('/user' ,userrouter); 


app.listen(PORT, () => {console.log(`Server is running on PORT ${PORT}`)});