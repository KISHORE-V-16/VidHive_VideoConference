const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

    username:{type:String,require:true},
    email:{type:String,require:true,unique:true},
    password:{type:String,require:true},
    
},{minimize:false})
const userModel = mongoose.model("aiusercheck",userSchema);  // The user is the name where a folder is created in db by this name "user"

module.exports = userModel;