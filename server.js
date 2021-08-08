const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const authroutes = require('./routes/AuthRoutes')
const multer = require('multer')

const bodyParser = require('body-parser')


require('dotenv').config();
const dotenv = require('dotenv');
const path = require('path')

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({
    extended: true
  }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

const dbURI = process.env.db_connect

mongoose.connect(dbURI,{ useNewUrlParser: true, useUnifiedTopology: true })
.then(res=>{
    console.log("connected to db")
})
.catch(err=>{
    console.log(err);
});

app.use("/", require('./routes/AuthRoutes'));
app.use(authroutes);



app.listen(process.env.PORT || 3001, ()=>{
    console.log("express running is localhost 3001");
})
