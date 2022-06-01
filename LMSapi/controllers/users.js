const adminModel = require("../models/admin.js");
const mentorModel = require("../models/mentors.js");
const skillModel = require("../models/skills.js");
const employeeDetailsModel = require("../models/employeeDetails.js");
const addressModel = require("../models/employeeAddressDetails.js");
const educationModel = require("../models/employeeEducationDetails.js");
const technicalSkillsModel = require("../models/employeeTechnicalSkills.js");
const experianceModel = require("../models/employeeExperiance.js");
const contactModel = require("../models/employeeContactDetails.js");
const empRejectModel = require("../models/employeeRejectData.js");
const batchModel = require("../models/batchdetails.js");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const employeeEducationDetails = require("../models/employeeEducationDetails.js");
//Mentors Registration

const mentorRegister = async (req, res, next) => {
  console.log(req.body);

  const { mentorName, empId, emailId, skills } = req.body;
  let password = (Math.random() + 1).toString(36).substring(7);
  // console.log("Password is",password);
  const empIdExist = await mentorModel.findOne({ empId: empId });

  try {
    if (empIdExist) {
      res.status(409).json({
        error: true,
        message: "Employee ID Alreday Exist",
        data: null,
      });
    } else {
      var transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 2525,
        secure: false,
        requireTLS: true,
        service: "gmail",
        auth: {
          user: process.env.Email,
          pass: process.env.Password,
        },
      });
      var mailOptions = {
        from: process.env.Email,
        to: [emailId],
        subject: "User Registered Successfull",
        html: `<h3>Here is the credentials for you to login to the LMS </h3>
        <p>EmployeeId: ${empId}
        <p>Password : ${password}</p>`,
      };
      await transporter.sendMail(mailOptions, async (error) => {
        if (error) {
          console.log(error);
        } else {
          const saltRounds = 10;
          //salting
          const salt = await bcrypt.genSalt(saltRounds);

          //hashing
          const hashedPassword = await bcrypt.hash(password, salt);
          const mentor = new mentorModel({
            mentorName,
            empId,
            emailId,
            skills: [],
            password: hashedPassword,
          });

          const mentorData = await mentor.save();
          var skillsAsObject = [];
          skills.forEach((value) => {
            skillsAsObject.push({
              sName: value,
            });
          });
          console.log(skillsAsObject);
          for (let i = 0; i < skillsAsObject.length; i++) {
            const skillExist = await skillModel.findOne({
              sName: skillsAsObject[i].sName,
            });

            if (skillExist) {
              try {
                skillExist.empId.push(mentorData._id);
                await skillExist.save();
                mentorModel.findOne(
                  { _id: mentorData._id },
                  async (err, mentorid) => {
                    if (mentorid) {
                      mentorid.skills.push(skillExist._id);
                      await mentorid.save();

                      if (i === skills.length - 1) {
                        res.status(200).json({
                          error: false,
                          message: "Mentor Added Successfull",
                          data: mentorid,
                        });
                      }
                    } else {
                      res.status(409).json({
                        error: true,
                        message: "Mentor did not found to add skills",
                        data: null,
                      });
                    }
                  }
                );
              } catch (err) {
                next(err);
              }
            } else {
              const skill = new skillModel({
                sName: skillsAsObject[i].sName,
                empId: mentorData._id,
              });
              try {
                const skillData = await skill.save();
                mentorModel.findOne(
                  { _id: mentorData._id },
                  async (err, mentorid) => {
                    if (mentorid) {
                      mentorid.skills.push(skillData._id);
                      await mentorid.save();

                      if (i === skills.length - 1) {
                        res.status(200).json({
                          error: false,
                          message: "Mentor Added Successfull",
                          data: mentorid,
                        });
                      }
                    } else {
                      res.status(409).json({
                        error: true,
                        message: "Mentor did not found to add skills",
                        data: null,
                      });
                    }
                  }
                );
              } catch (err) {
                next(err);
              }
            }
          }
        }
      });
    }
  } catch (err) {
    next(err);
  }
};

//Getting the Metors

const getMentor = async (req, res, next) => {
  try {
    const mentorslist = await mentorModel
      .find()
      .populate("skills", "sName")
      .lean();
    res.status(200).json({
      error: false,
      message: "MentorsList Getting.....",
      data: mentorslist,
    });
  } catch (err) {
    next(err);
  }
};

//Mentors Edit

const mentorEdit = async (req, res, next) => {
  console.log(req.body);
  const { mentorName, empId, emailId, skills } = req.body;
  try {
    const mentorData = await mentorModel.findOne({ empId: empId });
    if (mentorData) {
      mentorData.skills.splice(0, mentorData.skills.length);

      await mentorModel.updateOne(
        {
          empId,
        },
        {
          mentorName,
          empId,
          emailId,
          skills: [],
        }
      );
      var skillsAsObject = [];
      skills.forEach((value) => {
        skillsAsObject.push({
          sName: value,
        });
      });
      console.log(skillsAsObject);
      for (let i = 0; i < skillsAsObject.length; i++) {
        console.log("For loop", skillsAsObject[i]);
        const skillExist = await skillModel.findOne({
          sName: skillsAsObject[i].sName.sName,
        });
        //  console.log("Skill Exist");
        if (skillExist) {
          try {
            skillExist.empId.push(mentorData._id);
            await skillExist.save();
            mentorModel.findOne(
              { _id: mentorData._id },
              async (err, mentorid) => {
                if (mentorid) {
                  mentorid.skills.push(skillExist._id);
                  await mentorid.save();

                  if (i === skills.length - 1) {
                    res.status(200).json({
                      error: false,
                      message: "Mentor Edited Successfull",
                      data: mentorid,
                    });
                  }
                } else {
                  res.status(409).json({
                    error: true,
                    message: "Mentor did not found to add skills",
                    data: null,
                  });
                }
              }
            );
          } catch (err) {
            next(err);
          }
        } else {
          const skill = new skillModel({
            sName: skillsAsObject[i].sName.sName,
            empId: mentorData._id,
          });
          try {
            const skillData = await skill.save();
            mentorModel.findOne(
              { _id: mentorData._id },
              async (err, mentorid) => {
                if (mentorid) {
                  mentorid.skills.push(skillData._id);
                  await mentorid.save();

                  if (i === skills.length - 1) {
                    res.status(200).json({
                      error: false,
                      message: "Mentor Edited Successfull",
                      data: mentorid,
                    });
                  }
                } else {
                  res.status(409).json({
                    error: true,
                    message: "Mentor did not found to add skills",
                    data: null,
                  });
                }
              }
            );
          } catch (err) {
            next(err);
          }
        }
      }
      // res.json({
      //   error: false,
      //   message: "Mentor Edited Successfull",
      //   data: mentorData,
      // });
    } else {
      res.json({
        error: true,
        message: "Mentor Data did not found",
        data: null,
      });
    }
  } catch (err) {
    next(err);
  }
};

//Mentor Delete

const mentorDelete = async (req, res, next) => {
  console.log(req.query);
  try {
    const empId = req.query.empId;
    await mentorModel.deleteOne({ empId });
    res.status(200).json({
      error: false,
      message: "Mentor Deleted Successfull",
      data: null,
    });
  } catch (err) {
    next(err);
  }
};

//Login
const userLogin = async (req, res, next) => {
  console.log(req.body);
  const { empId, password } = req.body;

  try {
    // console.log("try block");
    const adminData = await adminModel.findOne({ empId });
    const mentorsData = await mentorModel.findOne({ empId });
    const employeeData = await employeeDetailsModel
      .findOne({ empId })
      .populate("addressDetails")
      .populate("technicalSkills", "skill");
    console.log(adminData);
    if (adminData) {
      const { empId, role } = adminData;
      if (password === adminData.password) {
        const payload = { empId, role };
        const token = jwt.sign(payload, process.env.SECRET_KEY, {
          expiresIn: "24h",
        });
        res.status(200).json({
          error: false,
          message: "Admin Login Successfull",
          data: {
            empId,
            role,
            token,
          },
        });
      } else {
        res.json({
          error: true,
          message: "Invalid Password",
          data: null,
        });
      }
    } else if (mentorsData) {
      const { mentorName, empId, emailId, role, passwordChanged, batchId } =
        mentorsData;

      //bcrypt comapre
      const isPasswordMatched = await bcrypt.compare(
        password,
        mentorsData.password
      );
      if (isPasswordMatched) {
        const payload = { mentorName, empId, emailId, role };
        const token = jwt.sign(payload, process.env.SECRET_KEY, {
          expiresIn: "24h",
        });
        res.status(200).json({
          error: false,
          message: "Mentor Login Succefull",
          data: {
            mentorName,
            empId,
            emailId,
            role,
            batchId,
            passwordChanged,
            token,
          },
        });
      } else {
        res.json({
          error: true,
          message: "Password Incorrect",
          data: null,
        });
      }
    } else if (employeeData) {
      console.log(employeeData);
      const {
        empName,
        empId,
        emailId,
        role,
        addressDetails,
        technicalSkills,
        passwordChanged,
      } = employeeData;
      const empStatus = await employeeDetailsModel.findOne({ empId: empId });
      console.log(empStatus);
      if (empStatus.approveStatus === "approve") {
        //bcrypt comapre
        const isPasswordMatched = await bcrypt.compare(
          password,
          employeeData.password
        );
        if (isPasswordMatched) {
          const payload = { empName, empId, emailId, role };
          const token = jwt.sign(payload, process.env.SECRET_KEY, {
            expiresIn: "24h",
          });
          res.status(200).json({
            error: false,
            message: "Employee Login Succefull",
            data: {
              empName,
              empId,
              emailId,
              passwordChanged,
              role,
              token,
              addressDetails,
              technicalSkills,
            },
          });
        } else {
          res.json({
            error: true,
            message: "Password Incorrect",
            data: null,
          });
        }
      } else if (empStatus.approveStatus === "reject") {
        res.json({
          error: true,
          message: "Your Registration Rejected",
          data: null,
        });
      } else {
        res.json({
          error: true,
          message: "Your Registration not yet approved",
          data: null,
        });
      }
    } else {
      res.status(401).json({
        error: true,
        message: "EmpId doesnot exist",
        data: null,
      });
    }
  } catch (err) {
    next(err);
  }
};

//Employee Register

const employeeRegister = async (req, res, next) => {
  console.log(req.body);
  const {
    empId,
    empName,
    doj,
    dob,
    emailId,
    bloodg,
    designation,
    gender,
    nationality,
    empStatus,
    panNo,
    aadharNo,
    fatherName,
    motherName,
    spouseName,
    passportNo,
    maritalStatus,
    educationDetails,
    addressDetails,
    accountNo,
    bankName,
    accountType,
    ifscCode,
    branch,
    bState,
    technicalSkills,
    experiance,
    contact,
  } = req.body;
  let password = (Math.random() + 1).toString(36).substring(7);
  const empIdExist = await employeeDetailsModel.findOne({ empId: empId });
  try {
    if (empIdExist) {
      res.json({
        error: true,
        message: "Employee ID Alreday Exist",
        data: null,
      });
    } else {
      var transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 2525,
        secure: false,
        requireTLS: true,
        service: "gmail",
        auth: {
          user: process.env.Email,
          pass: process.env.Password,
        },
      });
      var mailOptions = {
        from: process.env.Email,
        to: [emailId],
        subject: "Employee Registration Successfull",
        html: `<h3>Here is the credentials for you to login to the LMS. Please wait for the Admin approval to Login </h3>
        <p>EmployeeId: ${empId}
        <p>Password : ${password}</p>`,
      };
      await transporter.sendMail(mailOptions, async (error) => {
        if (error) {
          console.log(error);
        } else {
          const saltRounds = 10;
          //salting
          const salt = await bcrypt.genSalt(saltRounds);

          //hashing
          const hashedPassword = await bcrypt.hash(password, salt);

          const employee = new employeeDetailsModel({
            empId,
            empName,
            doj,
            dob,
            emailId,
            bloodg,
            designation,
            gender,
            nationality,
            empStatus,
            panNo,
            aadharNo,
            fatherName,
            motherName,
            spouseName,
            passportNo,
            maritalStatus,
            educationDetails: [],
            addressDetails: [],
            accountNo,
            bankName,
            accountType,
            ifscCode,
            branch,
            bState,
            technicalSkills: [],
            experiance: [],
            contact: [],
            password: hashedPassword,
          });

          const employeeData = await employee.save();
          let empEducationData = null;
          let empAddressData = null;
          //EducationDetails Saving
          for (let i = 0; i < educationDetails.length; i++) {
            const education = new educationModel({
              empId: employeeData.empId,
              educationType: educationDetails[i].educationType,
              yop: educationDetails[i].yop,
              percentage: educationDetails[i].percentage,
              universityName: educationDetails[i].universityName,
              instituteName: educationDetails[i].instituteName,
              specialization: educationDetails[i].specialization,
              state: educationDetails[i].state,
            });

            try {
              empEducationData = await education.save();
              employeeDetailsModel.findOne(
                { _id: employeeData._id },
                async (err, emp) => {
                  if (emp) {
                    emp.educationDetails.push(empEducationData._id);
                    await emp.save();
                  } else {
                    res.json({
                      error: true,
                      message: "Employee Did not found",
                      data: null,
                    });
                  }
                }
              );
            } catch (err) {
              next(err);
            }
          }

          //AddressDetails Saving
          for (let i = 0; i < addressDetails.length; i++) {
            const address = new addressModel({
              empId: employeeData.empId,
              addressType: addressDetails[i].addressType,
              drNo: addressDetails[i].drNo,
              street: addressDetails[i].street,
              locality: addressDetails[i].locality,
              city: addressDetails[i].city,
              state: addressDetails[i].state,
              pinCode: addressDetails[i].pinCode,
              landmark: addressDetails[i].landmark,
            });

            try {
              empAddressData = await address.save();
              employeeDetailsModel.findOne(
                { _id: employeeData._id },
                async (err, emp) => {
                  if (emp) {
                    emp.addressDetails.push(empAddressData._id);
                    await emp.save();
                  } else {
                    res.json({
                      error: true,
                      message: "Employee Did not found",
                      data: null,
                    });
                  }
                }
              );
            } catch (err) {
              next(err);
            }
          }

          //Skills Saving
          for (let i = 0; i < technicalSkills.length; i++) {
            const skillsExist = await technicalSkillsModel.findOne({
              skill: technicalSkills[i].skill,
            });
            if (skillsExist) {
              try {
                skillsExist.empId.push(employeeData.empId);
                await skillsExist.save();
                console.log(skillsExist);
                employeeDetailsModel.findOne(
                  { _id: employeeData._id },
                  async (err, employee) => {
                    if (employee) {
                      employee.technicalSkills.push(skillsExist._id);
                      await employee.save();
                    } else {
                      res.json({
                        error: true,
                        message: "Employee id did not found to add skills",
                        data: null,
                      });
                    }
                  }
                );
              } catch (err) {
                next(err);
              }
            } else {
              const skills = new technicalSkillsModel({
                empId: employeeData.empId,
                skill: technicalSkills[i].skill,
                skillRating: technicalSkills[i].skillRating,
                yoeSkills: technicalSkills[i].yoeSkills,
              });
              try {
                const skillData = await skills.save();
                employeeDetailsModel.findOne(
                  { _id: employeeData._id },
                  async (err, employee) => {
                    if (employee) {
                      employee.technicalSkills.push(skillData._id);
                      await employee.save();
                    } else {
                      res.json({
                        error: true,
                        message: "Employee id did not found to add skills",
                        data: null,
                      });
                    }
                  }
                );
              } catch (err) {
                next(err);
              }
            }
          }

          for (let i = 0; i < experiance.length; i++) {
            const exp = new experianceModel({
              empId: employeeData.empId,
              companyName: experiance[i].companyName,
              eYoe: experiance[i].eYoe,
              eDoj: experiance[i].eDoj,
              dor: experiance[i].dor,
              eDesignation: experiance[i].eDesignation,
              eLocation: experiance[i].eLocation,
            });

            try {
              const expData = await exp.save();
              employeeDetailsModel.findOne(
                { _id: employeeData._id },
                async (err, emp) => {
                  if (emp) {
                    emp.experiance.push(expData._id);
                    await emp.save();
                  } else {
                    res.json({
                      error: true,
                      message: "Employee id did not found to add experiance",
                      data: null,
                    });
                  }
                }
              );
            } catch (err) {
              next(err);
            }
          }

          for (let i = 0; i < contact.length; i++) {
            const con = new contactModel({
              empId: employeeData.empId,
              contactType: contact[i].contactType,
              contactNo: contact[i].contactNo,
            });
            try {
              const contactData = await con.save();
              employeeDetailsModel.findOne(
                { _id: employeeData._id },
                async (err, emp) => {
                  if (emp) {
                    emp.contact.push(contactData._id);
                    await emp.save();
                    if (i === contact.length - 1) {
                      res.json({
                        error: false,
                        message: "Employee Registraion Successfull",
                        data: emp,
                      });
                    }
                  } else {
                    res.json({
                      error: true,
                      message: "Employee id did not found to add contact",
                      data: null,
                    });
                  }
                }
              );
            } catch (err) {
              next(err);
            }
          }
        }
      });
    }
  } catch (err) {
    next(err);
  }
};
const employeeEdit = async (req, res, next) => {
  console.log(req.body);
  const {
    empId,
    empName,
    doj,
    dob,
    emailId,
    bloodg,
    designation,
    gender,
    nationality,
    empStatus,
    panNo,
    aadharNo,
    fatherName,
    motherName,
    spouseName,
    passportNo,
    maritalStatus,
    educationDetails,
    addressDetails,
    accountNo,
    bankName,
    accountType,
    ifscCode,
    branch,
    state,
    technicalSkills,
    experiance,
    contact,
  } = req.body;

  const employeeData = await employeeDetailsModel.findOne({ empId: empId });
  console.log(employeeData.educationDetails);
  try {
    await employeeDetailsModel.updateOne(
      {
        empId,
      },
      {
        empName,
        doj,
        dob,
        emailId,
        bloodg,
        gender,
        nationality,
        panNo,
        aadharNo,
        fatherName,
        motherName,
        spouseName,
        passportNo,
        maritalStatus,
        accountNo,
        bankName,
        accountType,
        ifscCode,
        branch,
        state,
      }
    );

    for (let i = 0; i < educationDetails.length; i++) {
      try {
        await educationModel.updateOne(
          {
            _id: educationDetails[i]._id,
          },
          {
            educationType: educationDetails[i].educationType,
            yop: educationDetails[i].yop,
            percentage: educationDetails[i].percentage,
            universityName: educationDetails[i].universityName,
            instituteName: educationDetails[i].instituteName,
            specialization: educationDetails[i].specialization,
            state: educationDetails[i].state,
          }
        );
      } catch (err) {
        next(err);
      }
    }

    for (let i = 0; i < addressDetails.length; i++) {
      try {
        await addressModel.updateOne(
          {
            _id: addressDetails[i]._id,
          },
          {
            addressType: addressDetails[i].addressType,
            drNo: addressDetails[i].drNo,
            street: addressDetails[i].street,
            locality: addressDetails[i].locality,
            city: addressDetails[i].city,
            state: addressDetails[i].state,
            pinCode: addressDetails[i].pinCode,
            landmark: addressDetails[i].landmark,
          }
        );
      } catch (err) {
        next(err);
      }
    }

    // const empData = await employeeDetailsModel.findOne({empId:empId})
    // empData.technicalSkills.splice(0, empData.technicalSkills.length);

    // for (let i = 0; i < technicalSkills.length; i++) {
    //   const skillsExist = await technicalSkillsModel.findOne({
    //     skill: technicalSkills[i].skill,
    //   });
    //   if (skillsExist) {
    //     try {
    //       skillsExist.empId.push(empData.empId);
    //       await skillsExist.save();
    //       // console.log(skillsExist);
    //       employeeDetailsModel.findOne(
    //         { _id: empData._id },
    //         async (err, employee) => {
    //           if (employee) {
    //             employee.technicalSkills.push(skillsExist._id);
    //             await employee.save();
    //            console.log(employee);
    //             // if (i === technicalSkills.length - 1) {
    //             //   res.status(200).json({
    //             //     error: false,
    //             //     message: "Employee Registration Successfull",
    //             //     data: employee,
    //             //     empAddressData,
    //             //     empEducationData,
    //             //   });
    //             // }
    //           } else {
    //             res.status(409).json({
    //               error: true,
    //               message: "Employee id did not found to add skills",
    //               data: null,
    //             });
    //           }
    //         }
    //       );
    //     } catch (err) {
    //       next(err);
    //     }
    //   } else {
    //     const skills = new technicalSkillsModel({
    //       empId: empData.empId,
    //       skill: technicalSkills[i].skill,
    //       skillRating: technicalSkills[i].skillRating,
    //       yoeSkills: technicalSkills[i].yoeSkills,
    //     });
    //     try {
    //       const skillData = await skills.save();
    //       employeeDetailsModel.findOne(
    //         { _id: empData._id },
    //         async (err, employee) => {
    //           if (employee) {
    //             employee.technicalSkills.push(skillData._id);
    //             await employee.save();
    //           console.log(employee);
    //             // if (i === technicalSkills.length - 1) {
    //             //   res.status(200).json({
    //             //     error: false,
    //             //     message: "Employee Edited Successfull",
    //             //     data: employee,
    //             //     empAddressData,
    //             //     empEducationData,
    //             //   });
    //             // }
    //           } else {
    //             res.status(409).json({
    //               error: true,
    //               message: "Employee id did not found to add skills",
    //               data: null,
    //             });
    //           }
    //         }
    //       );
    //     } catch (err) {
    //       next(err);
    //     }
    //   }

    // }

    for (let i = 0; i < experiance.length; i++) {
      try {
        await experianceModel.updateOne(
          {
            _id: experiance[i]._id,
          },
          {
            companyName: experiance[i].companyName,
            yoe: experiance[i].yoe,
            doj: experiance[i].doj,
            dor: experiance[i].dor,
            designation: experiance[i].designation,
            location: experiance[i].location,
          }
        );
      } catch (err) {
        next(err);
      }
    }

    for (let i = 0; i < contact.length; i++) {
      try {
        await contactModel.updateOne(
          {
            _id: contact[i]._id,
          },
          {
            contactType: contact[i].contactType,
            contactNo: contact[i].contactNo,
          }
        );
        res.json({
          error: false,
          message: "Employee Edited Successfull",
          data: empId,
        });
      } catch (err) {
        next(err);
      }
    }
  } catch (err) {
    next(err);
  }
};
const employeeDelete = async (req, res, next) => {
  console.log(req.query);

  const { empId } = req.query;
  try {
    await employeeDetailsModel.deleteOne({ empId });
    await educationModel.deleteOne({ empId });
    await addressModel.deleteOne({ empId });
    await experianceModel.deleteOne({ empId });
    await contactModel.deleteOne({ empId });

    res.status(200).json({
      error: false,
      message: "Employee Deleted Successfull",
      data: empId,
    });
  } catch (err) {
    next(err);
  }
};

const employeeRegisterApprove = async (req, res, next) => {
  console.log(req.body);

  const { empId, batchId } = req.body;
  try {
    const employeeData = await employeeDetailsModel.findOne({ empId: empId });
    const batch = await batchModel.findOne({ batchId: batchId });
    console.log(batch);
    console.log(employeeData);
    if (employeeData && batch) {
      await employeeDetailsModel.updateOne(
        {
          empId: empId,
        },
        {
          $set: {
            approveStatus: "approve",
            batchName: batch.batchName,
            batchId: batch.batchId,
          },
        }
      );

      batchModel.findOne({ batchId: batchId }, async (err, bat) => {
        if (bat) {
          bat.employeesId.push(empId);
          await bat.save();
        } else {
          res.status(404).json({
            error: true,
            message: false,
            data: null,
          });
        }
      });

      res.status(200).json({
        error: false,
        message: "Employee Registration approved",
        data: {
          empId,
        },
      });
    } else {
      res.status(404).json({
        error: true,
        message: "Employee Id or Batch Id did not found",
        data: null,
      });
    }
  } catch (err) {
    next(err);
  }
};

const employeeRegisterReject = async (req, res, next) => {
  console.log(req.body);

  const { empId, reason } = req.body;
  try {
    const employeeData = await employeeDetailsModel.findOne({ empId: empId });
    console.log(employeeData);
    await employeeDetailsModel.updateOne(
      {
        empId: empId,
      },
      {
        $set: {
          approveStatus: "reject",
        },
      }
    );

    const empr = new empRejectModel({
      empId,
      empName: employeeData.empName,
      approveStatus: "reject",
      reason,
    });
    const employeeRejectData = await empr.save();

    res.status(200).json({
      error: false,
      message: "Employee Registration Rejected",
      data: employeeRejectData,
    });
  } catch (err) {
    next(err);
  }
};

const getSkills = async (req, res, next) => {
  try {
    const skillData = await skillModel.find().lean();
    res.status(200).json({
      error: false,
      message: "Skill getting",
      data: skillData,
    });
  } catch (err) {
    next(err);
  }
};

const getAllEmployees = async (req, res, next) => {
  try {
    const employeeData = await employeeDetailsModel
      .find()
      .populate(["educationDetails", "addressDetails", "experiance", "contact"])
      .populate("technicalSkills", "skill")
      .lean();
    res.status(200).json({
      error: false,
      message: "Employees Getting Successfull",
      data: employeeData,
    });
  } catch (err) {
    next(err);
  }
};

const getEmployeeDetailsBasedOnEmpId = async (req, res, next) => {
  console.log(req.query);
  const { empId } = req.query;
  try {
    const employeeData = await employeeDetailsModel
      .findOne({ empId: empId })
      .populate(["educationDetails", "addressDetails", "experiance", "contact"])
      .populate("technicalSkills")
      .lean();
    res.status(200).json({
      error: false,
      message: "Employee Getting Successfull",
      data: employeeData,
    });
  } catch (err) {
    next(err);
  }
};

const getEmployeeDetailsBasedOnBatchId = async (req, res, next) => {
  console.log(req.query);
  const { batchId } = req.query;
  try {
    const employeeData = await employeeDetailsModel
      .find({ batchId: batchId })
      .populate(["educationDetails", "addressDetails", "experiance", "contact"])
      .populate("technicalSkills", "skill")
      .lean();
    if (employeeData) {
      res.status(200).json({
        error: false,
        message: "Employee Getting Successfull",
        data: employeeData,
      });
    } else {
      res.json({
        error: true,
        message: "Employees did not Found on Batch",
        data: null,
      });
    }
  } catch (err) {
    next(err);
  }
};
const employeeStatusEdit = async (req, res, next) => {
  console.log(req.body);
  try {
    const { empId, empStatus } = req.body;
    const employeeData = await employeeDetailsModel.findOne({ empId: empId });
    if (employeeData) {
      await employeeDetailsModel.updateOne(
        {
        empId: empId,
      },
      {
        empStatus:empStatus
      }
      );
      res.json(
        {
          error:false,
          message:"Employee Status Updated",
          data:{
            empId,
            empStatus
          }
        }
      )
    } else {
      res.json({
        error: true,
        message: "EmployeeData did not found",
        data: null,
      });
    }
  } catch (err) {
    next(err);
  }
};
module.exports = {
  userLogin,
  mentorRegister,
  getMentor,
  mentorEdit,
  mentorDelete,
  employeeRegister,
  employeeRegisterApprove,
  employeeRegisterReject,
  employeeDelete,
  employeeEdit,
  getAllEmployees,
  getEmployeeDetailsBasedOnEmpId,
  getEmployeeDetailsBasedOnBatchId,
  getSkills,
  employeeStatusEdit,
};
