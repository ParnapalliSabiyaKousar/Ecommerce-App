const jwt = require("jsonwebtoken");


// ==========================
// VERIFY TOKEN
// ==========================

const verifyToken = (req, res, next) => {

  try {

    const authHeader =
      req.headers.authorization;


    // ==========================
    // CHECK TOKEN EXISTS
    // ==========================

    if (
      !authHeader ||
      !authHeader.startsWith("Bearer ")
    ) {

      return res.status(401).json({
        message: "No token provided"
      });
    }


    // ==========================
    // GET TOKEN
    // ==========================

    const token =
      authHeader.split(" ")[1];


    // ==========================
    // VERIFY TOKEN
    // IMPORTANT:
    // SAME SECRET AS auth.js
    // ==========================

    const decoded =
      jwt.verify(
        token,
        "SECRET"
      );


    // ==========================
    // SAVE USER DATA
    // ==========================

    req.user = {

      id: decoded.id,

      role: decoded.role
    };


    next();

  }

  catch (err) {

    console.log("TOKEN ERROR:", err);

    return res.status(401).json({

      message:
        "Invalid or expired token"
    });
  }
};



// ==========================
// ADMIN CHECK
// ==========================

const isAdmin = (req, res, next) => {

  try {

    // ==========================
    // CHECK USER EXISTS
    // ==========================

    if (!req.user) {

      return res.status(401).json({

        message:
          "Unauthorized"
      });
    }


    // ==========================
    // CHECK ADMIN ROLE
    // ==========================

    if (
      req.user.role !== "admin"
    ) {

      return res.status(403).json({

        message:
          "Access denied: Admin only"
      });
    }


    next();

  }

  catch (err) {

    console.log("ADMIN ERROR:", err);

    return res.status(500).json({

      message:
        "Server error"
    });
  }
};


// ==========================
// EXPORT
// ==========================

module.exports = {

  verifyToken,

  isAdmin
};