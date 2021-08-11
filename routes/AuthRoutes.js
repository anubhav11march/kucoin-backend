const {Router} = require("express");
const authController = require('../controllers/AuthController')
const router = Router();
const multer = require('multer')
const fs = require('fs')
const path = require('path')
const User = require("../models/UserModel")
const bcrypt = require("bcryptjs")
const jwt = require('jsonwebtoken');


 
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now())
    }
});
 
var upload = multer({ storage: storage });

const handleErrors = (err) =>{
    //console.log(err.message, err.code);
    let errors = {email:'', name:'', state:'', occupation_sector:''};
    let field;
    if(err.code === 11000){

        field=(Object.keys(Object.values(err)[4]));
        // console.log(field);

        if(field.length === 1){
            if(field[0]==='email'){
                errors.email='This email is already registered'
            }
        }else if(field.includes('email')){
            errors.email='This email already registered'
        }
    }else{
        console.log(err.errors.name);
        if(err.errors.name){
            errors.name=err.errors.name.message
        }
        if(err.errors.email){
            errors.email=err.errors.email.message
        }
        if(err.errors.state){
            errors.state=err.errors.state.message
        }
        if(err.errors.occupation_sector){
            errors.occupation_sector=err.errors.occupation_sector.message
        }
        if(err.errors.gender){
            errors.gender=err.errors.gender.message
        }
        if(err.errors.phone){
            errors.phone=err.errors.phone.message
        }
        if(err.errors.password){
            errors.password=err.errors.password.message
        }





            
        }

        console.log(errors);   
        return errors;

}



const maxAge = 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, 'test secret', { // You can add your own secret phrase
    expiresIn: maxAge
  });
};



router.post('/signup', upload.any(), async (req,res)=>{
    console.log(req)
    const salt = await bcrypt.genSalt();
    let password = await bcrypt.hash(req.body.password, salt);
    let obj ={
        name: req.body.name,
        email: req.body.email,
        gender: req.body.gender,
        phone: req.body.phone,
        password: password,
        img:{
            data:"",
            contentType: 'image/png'
        },
        balance:{
            value:0,
            currency:'USD'
        },
        logs:[],
    }
    console.log(obj)
    req.files.map(file=>{
        if(file.fieldname === "img"){
          obj.img.data =  fs.readFileSync(path.join(path.dirname(__dirname)+ '/uploads/' + file.filename))
        }
    })
    try{
        const user = await User.create(obj);
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(201).json({ user: user._id });
    }
    catch(err){
        errors = handleErrors(err);
        res.status(400).json({errors:errors});

    }

});


router.get('/users',  authController.users_get);

router.post('/login',upload.none(), async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await User.login(email, password);
      const token = createToken(user._id);
      res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
      res.status(200).json({ user: user._id });
    } 
    catch (err) {
      res.status(400).json(err);
    }
  
  }) 



module.exports = router;