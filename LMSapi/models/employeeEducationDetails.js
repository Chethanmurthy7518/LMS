const mongoose = require('mongoose')

const empEducationSchema = new mongoose.Schema({
    empId:{
        type:mongoose.Schema.Types.String,
        ref:'employeeDetails'
    },
    educationType:{
        type:String,
        minlength:2,
        maxlength:20,
        required:true
    },
    yop:{
        type:String,
        required:true
    },
    percentage:{
        type:String,
        minlength:2,
        maxlength:4,
        required:true
    },
    universityName:{
        type:String,
        minlength:2,
        maxlength:50,
        required:true
    },
    instituteName:{
        type:String,
        minlength:2,
        maxlength:50,
        required:true
    },
    specialization:{
        type:String,
        minlength:2,
        maxlength:50,
        required:true
    },
    state:{
        type:String,
        minlength:2,
        maxlength:20,
        required:true
    }
})

module.exports = mongoose.model('employeeEducationDetails',empEducationSchema)