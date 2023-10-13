const mongoose=require("mongoose")
const Schema=new mongoose.Schema({
    name:{
        type:String
    },
    post:{
        type:String
    },
    create:{
        type:String
    }
})

const User=mongoose.model('users',Schema)
module.exports=User