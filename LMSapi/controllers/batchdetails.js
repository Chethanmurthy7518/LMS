const { query } = require("express");
const batchModel = require("../models/batchdetails.js");
const mentorsModel = require("../models/mentors.js");
const technologyModel = require("../models/technologies.js");

const batchRegister = async (req, res, next) => {
  // console.log(req.body.empId);
  let {
    batchName,
    batchId,
    empId,
    
    technologies,
    startDate,
    endDate,
    status,
  } = req.body;
  console.log(empId);
  const batchIdExist = await batchModel.findOne({ batchId: batchId });

  try {
    if (batchIdExist) {
      res.status(409).json({
        error: true,
        message: "Batch Alreday Exist",
        data: null,
      });
    } else {
      console.log("Else Condition");
      const mentorId = await mentorsModel.findOne({ empId: empId });
      console.log(mentorId);
      const batch = new batchModel({
        batchName,
        mentorName:mentorId.mentorName,
        batchId,
        empId: mentorId.empId,
        technologies: [],
        startDate,
        endDate,
        status,
      });

      const batchData = await batch.save();

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
            batchModel.findOne({ _id: batchData._id }, async (err, batchid) => {
              if (batchid) {
                batchid.technologies.push(technologyExist._id);
                await batchid.save();

                if (i === technologies.length - 1) {
                  res.status(200).json({
                    error: false,
                    message: "Batch Added Successfull",
                    data: batchid,
                  });
                }
              } else {
                res.status(409).json({
                  error: true,
                  message: "Batch id did not found to add technology",
                  data: null,
                });
              }
            });
          } catch (err) {
            next(err);
          }
        } else {
          const technology = new technologyModel({
            technologyName: technologyAsObject[i].technologyName,
          });
          try {
            const technologyData = await technology.save();
            batchModel.findOne({ _id: batchData._id }, async (err, batchid) => {
              if (batchid) {
                batchid.technologies.push(technologyData._id);
                await batchid.save();

                if (i === technologies.length - 1) {
                  res.status(200).json({
                    error: false,
                    message: "Batch Added Successfull",
                    data: batchid,
                  });
                }
              } else {
                res.status(409).json({
                  error: true,
                  message: "Batch id did not found to add technology",
                  data: null,
                });
              }
            });
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

const getAllbatches = async (req, res, next) => {
  try {
    const batchData = await batchModel.find().populate(["technologies"]).lean();
    res.status(200).json({
      error: false,
      message: "All batches getting Successfull",
      data: batchData,
    });
  } catch (err) {
    next(err);
  }
};

const getBatchByEmpId = async (req,res,next)=>{
  console.log(req.query);
  try{
    const {empId} = req.query
    console.log(empId);
    const batchData = await batchModel.find({empId}).populate(["technologies"]).lean();
    if(batchData){
      res.status(200).json({
        error:false,
        message:"Employee Batch Found",
        data:batchData
      })
    }
    else{
      res.json({
        error:true,
        message:"Batch Id did not found",
        data:null
      })
    }
  }
  catch(err){
    next(err)
  }
}
const getMentorBatch = async (req, res, next) => {
  console.log(req.body);
  const { empId } = req.body;
  try {
    const mentorBatchData = await batchModel
      .findOne({ empId })
      .populate("technologies")
      .lean();
    if (mentorBatchData) {
      res.status(200).json({
        error: false,
        message: "Mentor Batch Getting Successfull",
        data: mentorBatchData,
      });
    } else {
      res.status(200).json({
        error: true,
        message: "Mentor Id did not found",
        data: mentorBatchData,
      });
    }
  } catch (err) {
    next(err);
  }
};

const deleteBatch = async (req, res, next) => {
  console.log(req.query);
  const { batchId } = req.query;
  try {
    if(batchId){
      await batchModel.deleteOne({ batchId });
    res.status(200).json({
      error: false,
      message: "Batch Deleted Successfull",
      data: null,
    });
    }
    else{
      res.status(200).json({
        error: true,
        message: "Batch Deleted UnSuccessfull",
        data: null,
      });
    }
  } catch (err) {
    next(err);
  }
};

const batchEdit = async (req, res, next) => {
  console.log(req.body);
  let { batchId, status } = req.body;
  try {
    await batchModel.updateOne(
      {
        batchId,
      },
      {
        $set: {
          status,
        },
      }
    );
    res.status(200).json({
      error:false,
      message:"Batch Edited Successfull",
      data:{
        batchId,
        status
      }
    })
  } catch (err) {
    next(err);
  }
};
module.exports = {
  batchRegister,
  getAllbatches,
  getBatchByEmpId,
  getMentorBatch,
  deleteBatch,
  batchEdit,
};
