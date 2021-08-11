const {Router} = require("express");
const router = Router();
const multer = require('multer')
const fs = require('fs')
const path = require('path')
const User = require("../models/UserModel")
const Order = require('../models/Order')


router.get('/account', async(req, res)=>{
    User.findById(res.locals.user._id)
    .then(user=>{
        res.json(user)
    })
})

router.get('/balance', async(req,res)=>{
    User.findById(res.locals.user._id)
    .then(user=>{
        res.json(user.balance)
    })
})

router.get('/logs', async(req,res)=>{
    User.findById(res.locals.user._id)
    .then(user=>{
        res.json(user.logs)
    })
})

router.get('/orders', async(req,res)=>{
    Order.find({user_id:res.locals.user._id})
    .then(orders=>{
        res.json(orders)
    })
})

module.exports = router;
