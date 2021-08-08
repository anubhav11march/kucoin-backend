const mongoose = require("mongoose");
const { isEmail} = require("validator")


const UserSchema = new mongoose.Schema({
    img:{   
        data: Buffer,
        contentType: String
    },
    name:{
        type: String,
        required:[true, "Please enter your name"]
    },
    gender:{
        type: String,
        required:[true, "Please enter your gender"]
    },
    email:{
        type: String,
        required:[true, "Please enter an email"],
        unique: true,
        validate: [isEmail, "Please enter a valid email"]
    },
    phone:{
        type: String,
        required:[true, "Please enter your phone number"]
    },




}, {versionKey:false})


const User = mongoose.model('user', UserSchema);

module.exports = User;