const mongoose = require("mongoose");

const empAddressDetails = new mongoose.Schema({
  empId: {
    type: mongoose.Schema.Types.String,
    ref: "employeeDetails",
  },
  addressType: {
    type: String,
    minlength: 2,
    maxlength: 100,
    required: true,
  },
  drNo: {
    type: String,
    minlength: 2,
    maxlength: 10,
    required: true,
  },
  street: {
    type: String,
    minlength: 3,
    maxlength: 20,
    required: true,
  },
  locality: {
    type: String,
    minlength: 3,
    maxlength: 20,
    required: true,
  },
  city: {
    type: String,
    minlength: 2,
    maxlength: 20,
    required: true,
  },
  state: {
    type: String,
    minlength: 2,
    maxlength: 20,
    required: true,
  },
  pinCode: {
    type: String,
    minlength: 6,
    maxlength: 7,
    required: true,
  },
  landmark: {
    type: String,
    minlength: 5,
    maxlength: 50,
    required: true,
  },
});

module.exports = mongoose.model("employeeAddressDetails", empAddressDetails);
