const mongoose = require('mongoose')

const empExperiance = new mongoose.Schema({
    empId:{
        type:mongoose.Schema.Types.String,
        ref:'employeeDetails'
    },
    companyName:{
        type:String,
        minlength:2,
        maxlength:50,
        required:true
    },
    eYoe:{
        type:String,
        required:true
    },
    eDoj:{
        type:String,
        required:true
    },
    dor:{
        type:String,
        required:true
    },
    eDesignation:{
        type:String,
        minlength:4,
        maxlength:200,
        required:true
    },
    eLocation:{
        type:String,
        minlength:2,
        maxlength:20,
        required:true
    }
})

module.exports = mongoose.model('employeeExperiance',empExperiance)