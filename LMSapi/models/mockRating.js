const mongoose = require("mongoose");

const mockSchema = new mongoose.Schema({
  empId: {
    type: mongoose.Schema.Types.String,
    ref: "employeeDetails",
  },
  batchId:{
    type:mongoose.Schema.Types.String,
    ref:"employeeDetails"
  },
  mockType: {
    type: String,
    minlength: 1,
    maxlength: 200,
    required: true,
  },
  mockTakenBy: {
    type: String,
    minlength: 1,
    maxlength: 200,
    required: true,
  },
  technology: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "technologies",
  },
  practicalKnowledge: {
    type: Number,
    required: true,
  },
  theoreticalKnowledge: {
    type: Number,
    required: true,
  },
  feedback: {
    type: String,
    minlength: 4,
    maxlength: 50,
    required: true, 
  },
  detailedFeedback: {
    type: String,
    required: true,
  },
});


module.exports = mongoose.model('employeeMock',mockSchema)