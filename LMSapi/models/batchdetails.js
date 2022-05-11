const mongoose = require("mongoose");
const run = require("nodemon/lib/monitor/run");

const batchSchema = new mongoose.Schema({
  batchName: {
    type: String,
    minlength: 1,
    maxlength: 200,
    required: true,
  },
  mentorName: {
    type:String,
    minlength:1,
    maxlength:20,
    required:true
  },
  batchId:{
    type:String,
    minlength:1,
    maxlength:20,
    required:true
  },
  empId:{
    type:mongoose.Schema.Types.String,
    ref:'mentors'
  },
  technologies:[{
      type:mongoose.Schema.Types.ObjectId,
      ref:'technologies'
  }],
  startDate:{
      type:String,
      required:true
  },
  endDate:{
      type:String,
      required:true
  },
  status:{
      type:String,
      minlength:1,
      maxlength:20,
      required:true
  },
  employeesId:[{
   type:mongoose.Schema.Types.String,
   ref:'employeeDetails'
  }]
});

module.exports = mongoose.model('batches',batchSchema)