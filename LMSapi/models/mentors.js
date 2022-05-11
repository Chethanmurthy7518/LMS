const mongoose = require("mongoose");

const mentorSchema = new mongoose.Schema({
  mentorName: {
    type: String,
    minlength:1,
    maxlength:200,
    required:true
  },
  empId:{
      type:String,
      minlength:5,
      maxlength:20,
      required:true
  },
  emailId:{
      type:String,
      minlength:7,
      maxlength:30,
      required:true
  },
  skills:[
      {
          type:mongoose.Schema.Types.ObjectId,
          ref:'skills'
      }
  ],
  password:{
      type:String,
      
      required:true
  },
  passwordChanged:{
      type:Boolean,
      default:false
  },
  role:{
      type:String,
      default:"mentor"
  }
});

module.exports = mongoose.model('mentors',mentorSchema)