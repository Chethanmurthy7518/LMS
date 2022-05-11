const mongoose = require("mongoose");

const empRejectSchema = new mongoose.Schema({
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
  approveStatus:{
      type:String
  },
  reason: {
    type: String,
    minlength: 5,
    maxlength: 200,
    required: true,
  },
});


module.exports = mongoose.model('rejectedEmployeesDetails',empRejectSchema)