const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');

const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;

  // check json web token exists & is verified
  if (token) {
    jwt.verify(token, 'net ninja secret', (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.send('You have been logged out, please login again');
      } else {
        console.log(decodedToken);
        next();
      }
    });
  } else {
    res.send('You have been logged out, please login again');
  }
};

// check current user
const checkUser = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, 'test secret', async (err, decodedToken) => { 
      //enter secret phrase entered in signup route  
      if (err) {
        res.locals.user = null;
        next();
      } else {
        let user = await User.findById(decodedToken.id);
        res.locals.user = user;
        next();
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
};


module.exports = { requireAuth, checkUser };