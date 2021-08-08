const {Router} = require("express");
const authController = require('../controllers/AuthController')
const router = Router();
const multer = require('multer')
const fs = require('fs')
const path = require('path')
const User = require("../models/UserModel")


 
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





            
        }

        console.log(errors);   
        return errors;

}

//





router.post('/signup', upload.any(), async (req,res)=>{
    console.log(req)
    let obj ={
        name: req.body.name,
        email: req.body.email,
        gender: req.body.gender,
        phone: req.body.phone,
        img:{
            data:"",
            contentType: 'image/png'
        }
    }
    console.log(obj)
    req.files.map(file=>{
        if(file.fieldname === "img"){
          obj.img.data =  fs.readFileSync(path.join(path.dirname(__dirname)+ '/uploads/' + file.filename))
        }
    })
    try{
        const user = await User.create(obj);
        res.status(201).json({user});
        res.send("client created")
    }
    catch(err){
        errors = handleErrors(err);
        res.status(400).json({errors:errors});

    }

});


router.get('/users',  authController.users_get);



module.exports = router;