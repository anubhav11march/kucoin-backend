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
    password:{
        type:String,
        required:[true, 'Please enter a password']
    },
    balance:{
        value: Number,
        currency: String,
    },
    orders:[{id:String, amount:Number, currency:String, created_at:Number, status:String}],
    logs:[{payment_id:String, timestamp:String}],






}, {versionKey:false})

UserSchema.statics.login = async function(email, password) {
    const user = await this.findOne({ email });
    if (user) {
      const auth = await bcrypt.compare(password, user.password);
      if (auth) {
        return user;
      }
      throw Error('incorrect password');
    }
    throw Error('incorrect email');
  };



const User = mongoose.model('user', UserSchema);

module.exports = User;