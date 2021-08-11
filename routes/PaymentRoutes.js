const {Router} = require("express");
const authController = require('../controllers/AuthController')
const router = Router();
const multer = require('multer')
const fs = require('fs')
const path = require('path')
const User = require("../models/UserModel")
const Order = require('../models/Order')
const Razorpay = require('razorpay')


var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now())
    }
});
var upload = multer({ storage: storage });

const razorpay = new Razorpay({
    key_id:'',     // Enter the Key ID generated from the Dashboard
    key_secret:'', // Enter the Key Secret generated from the Dashboard
  })
  

router.post('/createorder',upload.none(), async (req,res)=>{

        let options ={
           amount: parseInt(req.body.amount),
           currency: req.body.currency,
        };
        console.log(res.locals)
        console.log(options)
        razorpay.orders.create(options, function(err, order){
          console.log(order)
          User.findById(res.locals.user._id)
          .then(res=>{
              console.log(res)
              let user = res
              let saved_order={
                id:order.id, 
                amount:order.amount, 
                currency:order.currency, 
                created_at:order.created_at, 
                status:order.status,
                user_id: user._id
              }
              Order.create(saved_order)
              .then(res=>{
                console.log(res)
                user.save()
                .then(res=>{
                    console.log(res)
                })
                .catch(err=>{
                    console.log(err)
                })
                })
              .catch(err=>{
                console.log(err)
              })


          })
          res.json(order)
          console.log(err)
        })   
        


})

router.get('/paymentDemo', async (req,res)=>{
    res.sendFile(path.join(__dirname,'/views/paymentDemo.html'))
})

router.post('/ordercomplete',  async (req,res)=>{
    razorpay.payments.fetch(req.body.razorpay_payment_id).then((paymentDocument)=>{
        if(paymentDocument.status==="captured"){
            Order.findOne({id:req.body.razorpay_order_id})
            .then(res=>{
                console.log
                User.findById(res.user_id)
                .then(user=>{
                    user.balance.value = user.balance.value + res.amount/100
                    user.logs.push({
                        order_id:res.id,
                        payment_id:req.body.razorpay_payment_id,
                        user_id:user._id,
                        amount:res.amount/100,
                        completed_at: Date.now(),
                    })
                    user.save()
                    .then(res=>{
                        console.log(res)
                    })
                    .catch(err=>{
                        console.log(err)
                    })

                })
                .catch(err=>[
                    console.log(err)
                ])
                res.status = "completed"
                res.save()
                .then(res=>{
                    console.log(res)
                })
                .catch(err=>{
                    console.log(err)
                })
            })


            res.send("Payment successful, funds added to wallet")


        }else{
            res.send("Payment unsuccessful, make another order")
        }
    })
})

module.exports = router;