const jwt = require('jsonwebtoken');
const User = require('../model/userModel');

const requireAuth = async (req,res,next)=>{
    const token = req.cookies.log;
    if(token){
        try {
            const decodedToken = jwt.verify(token,process.env.SECRET_KEY);
            req.user = await User.findById(decodedToken.id);
            next();
        } catch (error) {
            console.log(error);
            res.redirect('/login');
        }
    }else{
        console.log('no token found');
        res.redirect('/login');
    }
}

module.exports = {requireAuth};