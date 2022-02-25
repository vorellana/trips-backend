const exp = {};
const jwt = require('jsonwebtoken');
const config = require('../../config');

exp.verifyToken = async (req, res, next) => {
    const token = req.headers["x-access-token"];
    if (!token) return res.status(403).json({ message: "No token provided" });  
    try {
        const decoded = jwt.verify(token, config.secret);
        next();
    } catch (error) {
        return res.status(401).json({ auth: false, message: "Unauthorized!", error });
    }
  };

  module.exports = exp;