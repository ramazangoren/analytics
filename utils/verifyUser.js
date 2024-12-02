import jwt from 'jsonwebtoken';

const verifyToken = (req, res, next) => {
  // console.log('Cookies:', req.cookies);
  const token = req.cookies.access_token;
  // console.log('Token:', token);
  if (!token) {
    console.log('No token provided');
    return res.status(403).json({ message: 'No token provided' });
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.log('JWT verification failed:', err.message);
      return res.status(403).json("Forbidden");
    }
    req.user = user;
    next();
  });
};

export default verifyToken;
