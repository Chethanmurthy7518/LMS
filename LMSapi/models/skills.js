const mongoose = require('mongoose')

const skillsSchema = new mongoose.Schema(
    {
        sName:{
            type:String,
            minlength:1,
            maxlength:20,
            required:true
        },
        empId:[
            {
                type:  mongoose.Schema.Types.ObjectId,
                ref:'mentors'
            }
        ]
    }
)

module.exports = mongoose.model('skills',skillsSchema)