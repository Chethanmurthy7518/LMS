const jwt = require("jsonwebtoken");

const authorizeAdmin = (req, res, next) => {
  console.log(req.headers.authorization);
  if (req.headers["authorization"]) {
    const token = req.headers["authorization"].split(" ")[1];
    const payload = jwt.verify(token, process.env.SECRET_KEY);

    if (payload.role === "admin") {
      next();
    } else {
      res.status(401).json({
        error: true,
        message: "Authorization failed",
        data: null,
      });
    }
  } else {
    res.status(401).json({
      error: true,
      message: "Not Authorized",
      data: null,
    });
  }
};

const authorizeMentor = (req, res, next) => {
  console.log(req.headers.authorization);

  if (req.headers["authorization"]) {
    const token = req.headers["authorization"].split(" ")[1];
    const payload = jwt.verify(token, process.env.SECRET_KEY);

    if (payload.role === "mentor") {
      next();
    } else {
      res.status(401).json({
        error: true,
        message: "Authorization failed",
        data: null,
      });
    }
  } else {
    res.status(401).json({
      error: true,
      message: "Not Authorized",
      data: null,
    });
  }
};

const authorizeEmployee = (req, res, next) => {
  console.log(req.headers.authorization);
  if (req.headers["authorization"]) {
    const token = req.headers["authorization"].split(" ")[1];
    const payload = jwt.verify(token, process.env.SECRET_KEY);
    if (payload.role === "employee") {
      next();
    } else {
      res.status(401).json({
        error: true,
        message: "Authorization failed",
        data: null,
      });
    }
  } else {
    res.status(401).json({
      error: true,
      message: "Not Authorized",
      data: null,
    });
  }
};
const authorizeAdminMentor = (req, res, next) => {
  console.log(req.headers.authorization);
  if (req.headers["authorization"]) {
    const token = req.headers["authorization"].split(" ")[1];
    const payload = jwt.verify(token, process.env.SECRET_KEY);

    if (payload.role === "admin" || payload.role === "mentor") {
      next();
    } else {
      res.status(401).json({
        error: true,
        message: "Authorization failed",
        data: null,
      });
    }
  } else {
    res.status(401).json({
      error: true,
      message: "Not Authorized",
      data: null,
    });
  }
};
const authorizeMentorEmployee = (req, res, next) => {
  console.log(req.headers.authorization);

  if (req.headers["authorization"]) {
    const token = req.headers["authorization"].split(" ")[1];
    const payload = jwt.verify(token, process.env.SECRET_KEY);

    if (payload.role === "mentor" || payload.role === "employee") {
      next();
    } else {
      res.status(401).json({
        error: true,
        message: "Authorization failed",
        data: null,
      });
    }
  } else {
    res.status(401).json({
      error: true,
      message: "Not Authorized",
      data: null,
    });
  }
};

module.exports = {
  authorizeAdmin,
  authorizeMentor,
  authorizeEmployee,
  authorizeAdminMentor,
  authorizeMentorEmployee
};
