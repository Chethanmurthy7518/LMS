const mentorsModel = require("../models/mentors.js");
const employeeModel = require("../models/employeeDetails.js");
const bcrypt = require("bcrypt");
async function passwordEncode(password) {
  let saltRounds = 10;
  let salt = await bcrypt.genSalt(saltRounds);

  //hashing
  let hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
}

const resetPassword = async (req, res, next) => {
  console.log(req.body);
  const { empId, epassword, password } = req.body;
  try {
    const mentorsData = await mentorsModel.findOne({ empId });
    const employeeData = await employeeModel.findOne({ empId });

    if (mentorsData) {
      const isExistingPasswordMatched = await bcrypt.compare(
        epassword,
        mentorsData.password
      );
      if (isExistingPasswordMatched) {
        const encodedPassword = await  passwordEncode(password)
        console.log('res', encodedPassword);
        await mentorsModel.updateOne(
          {
            empId,
          },
          {
            $set: {
              password: encodedPassword,
              passwordChanged:true
            },
          }
        );
        res.status(200).json({
          error: false,
          message: "Password Reset Successfull",
          data: {
            empId,
            password,
          },
        });
      }
    } else if (employeeData) {
      // console.log(employeeData);

      // console.log(encodedPassword);
      
      // console.log(encodedPassword);
      const isExistingPasswordMatched = await bcrypt.compare(
        epassword,
        employeeData.password
      );
      if (isExistingPasswordMatched) {
        const encodedPassword = await  passwordEncode(password)
        console.log('res', encodedPassword);
        console.log(employeeData);

        await employeeModel.updateOne(
          {
            empId,
          },
          {
            $set: {
              password: encodedPassword,
              passwordChanged:true
            },
          }
        );
        res.status(200).json({
          error: false,
          message: "Password Reset Successfull",
          data: {
            empId,
            password,
          },
        });
      } else {
        res.status(401).json({
          error: true,
          message: "Existing password incorrect",
          data: null,
        });
      }
    }
  } catch (err) {
    next(err);
  }
};

module.exports = {
  resetPassword,
};
