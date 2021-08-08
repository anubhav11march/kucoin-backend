const User = require("../models/UserModel");
const multer = require('multer')
const upload = multer();



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



module.exports.users_get = async(req, res) =>{
    User.find({}, (err, items) => {
        if (err) {
            console.log(err);
            res.status(500).send('An error occurred', err);
        }
        else {
            res.send(items)
        }
    });
}


