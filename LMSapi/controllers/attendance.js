const attendanceModel = require("../models/employeeAttendance.js");
const employeeModel = require("../models/employeeDetails.js");

const empAttendance = async (req, res, next) => {
  console.log(req.body);
  const { empId, session } = req.body;
  try {
    const employeeData = await employeeModel.findOne({ empId: empId });
    console.log(employeeData);
    if (employeeData) {
      const attendance = new attendanceModel({
        empId: employeeData.empId,
        empName: employeeData.empName,
        session: {
          morning: session.morning,
          noon: session.noon,
        },
      });

      const attendanceData = await attendance.save();
      res.status(200).json({
        error: false,
        message: "Employee Attendance Added Successfull",
        data: attendanceData,
      });
    } else {
      res.status(404).json({
        error: true,
        message: "Employee did not found",
        data: null,
      });
    }
  } catch (err) {
    next(err);
  }
};

const getAllEmployeeAttendance = async (req, res, next) => {
  try {
    const attendanceData = await attendanceModel.find().lean();
    res.status(200).json({
      error: false,
      message: "Attendance getting Successfull",
      data: attendanceData,
    });
  } catch (err) {
    next(err);
  }
};

const getAttendanceBasedOnEmpId = async (req, res, next) => {
  console.log(req.query);

  const { empId } = req.query;
  try {
      const attendanceData = await attendanceModel.findOne({empId:empId})
      if(attendanceData){
          res.status(200).json({
              error:false,
              message:"Attendance of Employee Getting",
              data:attendanceData
          })
      }
      else{
          res.status(404).json({
              error:true,
              message:"Attendance Data not availbale",
              data:null
          })
      }
  } catch (err) {
    next(err);
  }
};

module.exports = {
  empAttendance,
  getAllEmployeeAttendance,
  getAttendanceBasedOnEmpId
};
