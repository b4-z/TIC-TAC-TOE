const User = require('../model/userModel.js');
const jwt = require('jsonwebtoken');
// function for handle errors 
const errorHandler = (err)=>{
    //console.log(err, err.code);
    let errors = {email:"", username: "", password: ""} //an objct to hold the errors key then put the value
    
    if(err.message === "User not found"){
        errors.username = "the username is incorrect"
    }
        
    if(err.message === "Incorrect password"){
        errors.password = "the password is incorrect"
    }
    
    if (err.code === 11000) { //err.code holds the db errors like unique when U try dup name or whatever the db try to add it but throw an error and fail
        const field = Object.keys(err.keyValue)[0];
        errors[field] = `${field} already exists`;
        return errors;
    }

    if(err.name === "ValidationError"){ //err.name is just thhe name of the error that U see at the first line like SomeErr:
        Object.values(err.errors).forEach(({properties})=>{ //this errors not the variable we declared, the {properties} is distruction of error.properties !!!
            errors[properties.path] = properties.message;
        })
    }
    return errors;
}

const maxAge = 2 * 24 * 60 * 60;

const createToken = (id)=>{
    return jwt.sign({id},process.env.SECRET_KEY, {expiresIn: maxAge ,

    })
}

//Method 1

//module.exports.signup_get = (req,res)=>{
    //res.render('signup');
//}

//const signup_post = (req,res)=>{
    //res.send("new user signedup");
//}
//module.exports.login_get = (req,res)=>{
    //res.render('login');
//}

//const login_post = (req,res)=>{
    //res.send('loged in');
//}

//module.exports = {
    //signup_post,
   // login_post
//}

//Method 2 

module.exports.signup_get = (req,res)=>{
    res.render('signup');
}

module.exports.signup_post = async (req,res)=>{
    const recivedUsername = req.body.username;
    const recivedPassword = req.body.password;
    const reciivedConfirmPassword = req.body.confirmPassword;
    const reciivedEmail = req.body.email;
    //console.log(req.body)
    if(reciivedConfirmPassword !== recivedPassword){
        return res.status(400).json({errors:{confirmPassword:"password doesn't match"}});
    }

    try {
        const user = await User.create({email: reciivedEmail, username: recivedUsername, password: recivedPassword});// or us can use exact naming for the variables that use for geting the data from the req.body
        const token = createToken(user._id);
        res.cookie('log', token, {httpOnly: true,
        maxAge: 1000*maxAge})
        res.status(201).json({user:user._id});
    } catch (err) {
        const errors = errorHandler(err);
        res.status(400).json({errors});
    }
}
module.exports.login_get = (req,res)=>{ 
    res.render('login');
}
module.exports.login_post = async (req,res)=>{
    const {username, password} = req.body;
    try {
        const user = await User.login(username, password);// it is a static function in the user model
        const token = createToken(user._id);
        res.cookie('log',token,{maxAge:1000*maxAge, httpOnly:true})
        res.status(200).json({user: user._id});
    } catch (error) {
        const errors = errorHandler(error);
        res.status(400).json({errors})
        //console.log(errors)
    }
}

module.exports.logout_get = (req, res)=>{
    res.cookie('log','', {maxAge: 1});
    res.redirect('/');
}

// both mwthod are just some variable that hold a function which we used module.exports to can be used in other files
// but just for info that we dont have use the first method to send the variables but we can use the 2nd method too 