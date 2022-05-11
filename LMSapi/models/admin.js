const mongoose = require('mongoose')


const adminSchema = new mongoose.Schema(
    {
        empId:{
            type:String,
            default:"TYC0921168"
        },
        password:{
            type:String,
            default:"TYC0921168"
        },
        role:{
            type:String,
            default:"admin"
        }
    }
)

module.exports = mongoose.model('userAdmin',adminSchema)