const mongoose = require('mongoose');
const {isEmail} = require('validator');
const bcrypt = require('bcrypt');

// we have mongoose hooks that can be used before and after like: pre and post

/** @type {mongoose.SchemaDefinition} */// we need this line then creating a defiination to the schema 
const userSchemaDef = {
    email: {
        type:String,
        unique: true,
        required: [true,'please enter an email'],
        lowercase: true,
        validate: [isEmail,'please enter a valid email']
    },
    username: {
        type:String,
        unique: true,
        required: [true,"please enter an username"],
        lowercase: true,
        minlength: [3,"username must contain atleast 3 chars"]
    },
    password: {
        type: String,
        required: true,
        minlength: [8,"password must be atleast 8 char"]
    },

}


const userSchema = new mongoose.Schema(userSchemaDef,{timestamps: true});

userSchema.post('save',function (doc,next){
    console.log('the user have bing created',doc);
    next();
})//first param must be a string that tells after what ? like we want after saving the doc do somthing and
//  we need next() to tell the midlwar go to the next midlware

// we need to hash the password bfore the doc got saved so we use pre hook 
userSchema.pre('save', async function (){
    console.log('user creating and saving',this);//this still the documnt but in the local variable const "user" = await User.create({email: reciivedEmail, username: recivedUsername, password: recivedPassword})
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password,salt);
})

userSchema.statics.login = async function(username,password){
    const user = await this.findOne({username});
    if(user){
        const auth = await bcrypt.compare(password, user.password);
        if(auth){
            return user;
        }
        throw Error('Incorrect password');
    }
    throw Error('User not found')
}
const User = mongoose.model('user',userSchema);
module.exports = User;
