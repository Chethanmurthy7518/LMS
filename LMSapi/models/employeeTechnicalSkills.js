const mongoose = require("mongoose");
const empTechSchema = new mongoose.Schema({
  empId:[{
  type:mongoose.Schema.Types.String,
  ref:'employeeDetails'
  }],
  skill: {
    type: String,
    minlength: 5,
    maxlength: 10,
    required: true,
  },
  skillRating: {
    type: Number,
    required: true,
  },
  yoeSkills: {
    type: String,
    required: true,
  },
});


module.exports = mongoose.model('employeeTechnicalSkills',empTechSchema)