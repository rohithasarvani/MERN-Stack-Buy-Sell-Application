const jwt = require("jsonwebtoken");
const axios = require("axios");

const JWT_SECRET = process.env.JWT_SECRET;
const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY;


const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "Access Denied. No token provided." });
    }

    const token = authHeader.split(" ")[1]; 
    if (!token) {
      return res.status(401).json({ message: "Access Denied. No token provided." });
    }

   
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified; 
    next(); 
  } catch (error) {
    res.status(403).json({ message: "Invalid or expired token." });
  }
};


const verifyRecaptcha = async (req, res, next) => {
  const recaptchaToken = req.body.recaptchaToken; 
  if (!recaptchaToken) {
    return res.status(400).json({ message: "reCAPTCHA token is required." });
  }

  try {
    
    const response = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify`,
      null,
      {
        params: {
          secret: RECAPTCHA_SECRET_KEY,
          response: recaptchaToken,
        },
      }
    );

    if (!response.data.success) {
      return res.status(403).json({ message: "reCAPTCHA verification failed." });
    }

    next(); 
  } catch (error) {
    res.status(500).json({ message: "reCAPTCHA verification error." });
  }
};

module.exports = { authenticateToken, verifyRecaptcha };
