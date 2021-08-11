const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const authroutes = require('./routes/AuthRoutes')
const { requireAuth, checkUser } = require('./middleware/authMiddleware');
const paymentroutes = require('./routes/PaymentRoutes')
const accountroutes = require('./routes/AccountRoutes')
const multer = require('multer')
const API = require('kucoin-node-sdk')
const Razorpay = require('razorpay')

const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser');


require('dotenv').config();
const dotenv = require('dotenv');
const path = require('path')

const razorpay = new Razorpay({
  key_id:'rzp_test_YxdBIqQwD4xeIt',
  key_secret:'NUfcwAPV4TZ2mBj2VFOIYnOe',
})

app.use(cookieParser());
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


app.use(authroutes, checkUser);
app.use(paymentroutes, checkUser)
app.use(accountroutes, checkUser)


app.get('/payment', (req,res)=>{
  res.sendFile(path.join(__dirname,'/views/paymentDemo.html'))
})








app.listen(process.env.PORT || 3001, async ()=>{
    console.log("express running is localhost 3001");
})
