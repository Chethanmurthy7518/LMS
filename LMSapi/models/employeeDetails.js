const mongoose = require("mongoose");

const empDetailsSchema = new mongoose.Schema({
  empId: {
    type: String,
    minlength: 5,
    maxlength: 10,
    required: true,
  },
  empName: {
    type: String,
    minlength: 1,
    maxlength: 20,
    required: true,
  },
  doj: {
    type: String,
    required: true,
  },
  dob: {
    type: String,
    required: true,
  },
  emailId: {
    type: String,
    minlength: 5,
    maxlength: 20,
    required: true,
  },
  bloodg: {
    type: String,
    minlength: 1,
    maxlength: 4,
    required: true,
  },
  designation: {
    type: String,
    minlength: 5,
    maxlength: 200,
    required: true,
  },
  gender: {
    type: String,
    minlength: 4,
    maxlength: 7,
    required: true,
  },
  nationality: {
    type: String,
    minlength: 3,
    maxlength: 10,
    required: true,
  },
  empStatus: {
    type: String,
    required: true,
  },
  panNo: {
    type: String,
    minlength: 5,
    maxlength: 10,
    required: true,
  },
  aadharNo: {
    type: String,
    minlength: 12,
    maxlength: 12,
    required: true,
  },
  fatherName: {
    type: String,
    minlength: 1,
    maxlength: 20,
    required: true,
  },
  motherName: {
    type: String,
    minlength: 1,
    maxlength: 20,
    required: true,
  },
  spouseName: {
    type: String,
    minlength: 1,
    maxlength: 20,
  },
  passportNo: {
    type: String,
    minlength: 9,
    maxlength: 20,
    required: true,
  },
  maritalStatus: {
    type: String,
    minlength: 6,
    maxlength: 10,
    required: true,
  },
  educationDetails: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "employeeEducationDetails",
    },
  ],
  addressDetails: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "employeeAddressDetails",
    },
  ],
  accountNo: {
    type: String,
    required: true,
  },
  bankName: {
    type: String,
    minlength: 5,
    maxlength: 50,
    required: true,
  },
  accountType: {
    type: String,
    minlength: 5,
    maxlength: 50,
    required: true,
  },
  ifscCode: {
    type: String,
    minlength: 5,
    maxlength: 50,
    required: true,
  },
  branch: {
    type: String,
    minlength: 2,
    maxlength: 20,
    required: true,
  },
  bState: {
    type: String,
    minlength: 2,
    maxlength: 10,
    required: true,
  },
  technicalSkills: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "employeeTechnicalSkills",
    },
  ],
  experiance:[{
      type:mongoose.Schema.Types.ObjectId,
      ref:'employeeExperiance'
  }],
  contact:[{
      type:mongoose.Schema.Types.ObjectId,
      ref:'employeeContactDetails'
  }],

  role:{
   type:String,
   default:"employee"
  },
  password:{
    type:String,
    
    required:true
},
passwordChanged:{
  type:Boolean,
  default:false
},
approveStatus:{
    type:String,
    default:"pending"
},
batchName:{
    type:mongoose.Schema.Types.String,
    ref:'batches'
},
batchId:{
    type:mongoose.Schema.Types.String,
    ref:'batches'
}

});

module.exports = mongoose.model("employeeDetails", empDetailsSchema);
