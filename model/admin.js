const mongoose=require("mongoose")
const Schema=new mongoose.Schema({
    name:{
        type:String
    },
    email:{
        type:String
    },
    pass:{
        type:String
    },
})

const Admin=mongoose.model("admins",Schema)
module.exports=Admin