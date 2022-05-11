const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  empId: {
    type: mongoose.Schema.Types.String,
    ref: "employeeDetails",
  },
  empName: {
    type: mongoose.Schema.Types.String,
    ref: "employeeDetails",
  },
  session: {
    morning: {
      type: Boolean,
      default: true,
    },
    noon: {
      type: Boolean,
      default: true,
    },
    date:{
        type:Date,
        default:Date.now()
    }
  },
});

module.exports = mongoose.model('employeeAttendance',attendanceSchema)
