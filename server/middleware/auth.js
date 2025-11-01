import jwt from 'jsonwebtoken';

export default function (req, res, next) {
  const token = req.header('x-auth-token');
  console.log(token)
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);
    req.userId = decoded.userId;
    console.log(req.userId);
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};