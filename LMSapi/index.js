const express = require("express");
require("dotenv").config();
const cors = require("cors");

const port = process.env.PORT;

require("./config/db.js");
const app = express();

//Cors Middleware
app.use(cors());

//BodyParser MIddleware
app.use(express.urlencoded({ extended: true }));

//Json parser
app.use(express.json());

//Router level middleware
app.use('/lmsuser',require('./routes/lmsusers.js'))
app.use('/lms',require('./routes/lmsbatch.js'))

app.get("/test", (req, res, next) => {
  res.json({
    error: false,
    message: "Test is working",
    data: null,
  });
});

//Error handling middleware
app.use((err, req, res, next) => {
  res.status(500).json({
    error: true,
    message: err.message,
    data: null,
  });
});
app.listen(port, () => {
  console.log(`Port Listening at ${port}`);
});
