const mockModel = require("../models/mockRating.js");
const technologyModel = require("../models/technologies.js");
const employeeModel = require("../models/employeeDetails.js");
const createMockModel = require("../models/mockCreate.js");
const attendanceModel = require("../models/employeeAttendance.js");

const createMock = async (req, res, next) => {
  console.log(req.body);
  const { mockNo, technologies, panel, dateTime } = req.body;
  try {
    const mocknumber = await createMockModel.findOne({ mockNo: mockNo });
    console.log(mocknumber);
    if (mocknumber) {
      res.json({
        error: true,
        message: "Mock Number already exist",
        data: null,
      });
    } else {
      const mockc = new createMockModel({
        mockNo,
        technologies: [],
        panel,
        dateTime,
      });

      const createMockData = await mockc.save();

      var technologyAsObject = [];
      technologies.forEach((value) => {
        technologyAsObject.push({
          technologyName: value,
        });
      });
      console.log(technologyAsObject);
      for (let i = 0; i < technologyAsObject.length; i++) {
        const technologyExist = await technologyModel.findOne({
          technologyName: technologyAsObject[i].technologyName,
        });
        if (technologyExist) {
          try {
            createMockModel.findOne(
              { _id: createMockData._id },
              async (err, mockid) => {
                if (mockid) {
                  mockid.technologies.push(technologyExist._id);
                  await mockid.save();

                  if (i === technologies.length - 1) {
                    res.status(200).json({
                      error: false,
                      message: "Mock Created Successfull",
                      data: createMockData,
                    });
                  }
                } else {
                  res.status(409).json({
                    error: true,
                    message: "Mock id did not found",
                    data: null,
                  });
                }
              }
            );
          } catch (err) {
            next(err);
          }
        } else {
          const technology = new technologyModel({
            technologyName: technologyAsObject[i].technologyName,
          });
          try {
            const technologyData = await technology.save();
            createMockModel.findOne(
              { _id: createMockData._id },
              async (err, mockid) => {
                if (mockid) {
                  mockid.technologies.push(technologyData._id);
                  await mockid.save();

                  if (i === technologies.length - 1) {
                    res.status(200).json({
                      error: false,
                      message: "Mock Created Successfull",
                      data: createMockData,
                    });
                  }
                } else {
                  res.status(409).json({
                    error: true,
                    message: "mock Id did not found",
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
  } catch (err) {
    next(err);
  }
};
const getCreatedMock = async (req, res, next) => {
  try {
    const createdMockData = await createMockModel
      .find()
      .populate("technologyName")
      .lean();
    res.status(200).json({
      error: false,
      message: "Created mocks getting successfull",
      data: createdMockData,
    });
  } catch (err) {
    next(err);
  }
};
const mockRating = async (req, res, next) => {
  console.log(req.body);

  const {
    empId,
    mockType,
    mockTakenBy,
    technology,
    practicalKnowledge,
    theoreticalKnowledge,
    feedback,
    detailedFeedback,
  } = req.body;

  const employeeExist = await employeeModel.findOne({ empId: empId });
  //  console.log(employeeExist);
  try {
    if (!employeeExist) {
      res.status(404).json({
        error: true,
        message: "Employee Id Does Not exist",
        data: null,
      });
    } else {
      const technologyExist = await technologyModel.findOne({
        technologyName: technology,
      });
      console.log(technologyExist);
      if (!technologyExist) {
        const tech = new technologyModel({
          technologyName: technology,
        });
        const techData = await tech.save();
        console.log("tech", techData);
        const mock = new mockModel({
          empId,
          batchId: employeeExist.batchId,
          mockType,
          mockTakenBy,
          technology: techData._id,
          practicalKnowledge,
          theoreticalKnowledge,
          feedback,
          detailedFeedback,
        });

        const mockData = await mock.save();

        res.status(200).json({
          error: false,
          message: "Mock Data Added Successfull",
          data: mockData,
        });
      } else {
        const mock = new mockModel({
          empId,
          batchId: employeeExist.batchId,
          mockType,
          mockTakenBy,
          technology: technologyExist._id,
          practicalKnowledge,
          theoreticalKnowledge,
          feedback,
          detailedFeedback,
        });

        const mockData = await mock.save();
        res.status(200).json({
          error: false,
          message: "Mock Data Added Successfull",
          data: mockData,
        });
      }
    }
  } catch (err) {
    next(err);
  }
};

const getAllMockDetails = async (req, res, next) => {
  try {
    const mockData = await mockModel
      .find()
      .populate("technology", "technologyName")
      .lean();
    console.log(mockData);
    if (mockData) {
      res.status(200).json({
        error: false,
        message: "Mock Details getting Succesfull",
        data: mockData,
      });
    } else {
      res.status(200).json({
        error: true,
        message: "Mock Details did not found",
        data: null,
      });
    }
  } catch (err) {
    next(err);
  }
};

const getMockDetailsBasedOnEmployee = async (req, res, next) => {
  console.log(req.query);
  const { empId } = req.query;
  try {
    const mockdata = await mockModel
      .find({ empId})
      .populate("technology", "technologyName")
      .lean();
    if (mockdata) {
      res.status(200).json({
        error: false,
        message: "Mock Details getting Succesfull",
        data: mockdata,
      });
    } else {
      res.status(200).json({
        error: true,
        message: "Mock Details did not found",
        data: null,
      });
    }
  } catch (err) {
    next(err);
  }
};

const getEmployeeWithMockDataWithBatchId = async (req, res, next) => {
  console.log(req.query);
  const { batchId } = req.query;
  try {
    const EmployeeData = await employeeModel.find({ batchId }).lean();
    //  console.log("Employees",EmployeeData);
    const mockData = await mockModel
      .find({ batchId })
      .populate("technology", "technologyName")
      .lean();
    //  console.log(EmployeeData);
    // console.log("EmpId",empId);
    const attendanceData = await attendanceModel.find({batchId}).lean()
    res.json({
      error: false,
      message: "Employee Data with MockRating",
      data: {
        EmployeeData,
        mockData,
        attendanceData
      },
    });
  } catch (err) {
    next(err);
  }
};

const getEmployeeMockDetailsByBatchId = async (req, res, next) => {
  console.log(req.query);
  const { batchId } = req.query;
  try {
    const mockData = await mockModel.find({ batchId }).lean();
    if (mockData) {
      res.status(200).json({
        error: false,
        message: "Employees Mock Deatils of the Batch",
        data: mockData,
      });
    } else {
      res.json({
        error: true,
        message: "MockDetails Did not found",
        data: null,
      });
    }
  } catch (err) {
    next(err);
  }
};
module.exports = {
  createMock,
  getCreatedMock,
  mockRating,
  getAllMockDetails,
  getMockDetailsBasedOnEmployee,
  getEmployeeWithMockDataWithBatchId,
  getEmployeeMockDetailsByBatchId,
};
