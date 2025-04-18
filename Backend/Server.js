const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5001;
const cookieParser = require('cookie-parser');
const {connectDB} = require('./db/connector.js');
const authrouter = require('./Router/authrouter.js');

connectDB();
require('dotenv').config();

app.use(cookieParser());
app.use(bodyParser.json());

app.use(cors({ 
    origin: '*',
    methods: ['POST','GET'], // allow only POST requests
    optionsSuccessStatus: 200 // some legacy browsers choke on 204
  })); 



app.listen(PORT,()=>{
    console.log(`server is listening to the port ${PORT}`);
})



app.use('/auth',authrouter);

