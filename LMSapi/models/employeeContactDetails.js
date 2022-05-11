const mongoose = require('mongoose')

const empContactSchema = new mongoose.Schema({
    empId:{
        type:mongoose.Schema.Types.String,
        ref:'employeeDetails'
    },
    contactType:{
        type:String,
        minlength:2,
        maxlength:10,
        required:true
    },
    contactNo:{
        type:Number,
        required:true
    }
})

module.exports = mongoose.model('employeeContactDetails',empContactSchema)