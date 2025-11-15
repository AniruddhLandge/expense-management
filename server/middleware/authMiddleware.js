// const jwt = require('jsonwebtoken');
import jwt from "jsonwebtoken";

export default function auth(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const [scheme, token] = header.split(' ');
    if (scheme !== 'Bearer' || !token) {
      return res.status(401).json({ message: 'No token provided' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // JWT banate waqt ensure karo ki { id, name, email } include ho
    req.user = { id: decoded.id, name: decoded.name, email: decoded.email };
    return next();
  } catch (e) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};
