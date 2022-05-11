const mockModel = require("../models/mockRating.js");
const technologyModel = require("../models/technologies.js");
const employeeModel = require("../models/employeeDetails.js");
const createMockModel = require("../models/mockCreate.js");
const createMock = async (req, res, next) => {
  console.log(req.body);
  const { mockNo, technologyName, panel, dateTime } = req.body;
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
      const technology = await technologyModel.find({
        technologyName: technologyName,
      });
      //  console.log(technology);
      let technologyN = null;
      technology.forEach((value) => {
        technologyN = value;
      });
      console.log(technologyN);
      const mockc = new createMockModel({
        mockNo,
        technologyName: technologyN._id,
        panel,
        dateTime,
      });

      const createMockData = await mockc.save();

      res.status(200).json({
        error: false,
        message: "Mock Created Successfull",
        data: createMockData,
      });
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
      error:false,
      message:"Created mocks getting successfull",
      data:createdMockData
    })
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
  console.log(req.body);
  const { empId } = req.body;
  try {
    const mockdata = await mockModel
      .findOne({ empId: empId })
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

module.exports = {
  createMock,
  getCreatedMock,
  mockRating,
  getAllMockDetails,
  getMockDetailsBasedOnEmployee,
};
