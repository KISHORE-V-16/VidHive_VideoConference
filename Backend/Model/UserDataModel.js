const mongoose = require('mongoose');

const userDataSchema = new mongoose.Schema({

    username:{type:String,require:true},
    email:{type:String,require:true},
    history:{type:Array,require:true},
    heads:{type:String,require:true},
    date:{type:String,require:true},
    time:{type:String,require:true,unique:true},
    
},{minimize:false})
const UserDataModel = mongoose.model("historycontents",userDataSchema); 

module.exports = UserDataModel;