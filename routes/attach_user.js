const User = require('../models/user.model');

const attach_user = async(req, res, next) => {
  const decodedTokenData = req.token;
  const userRecord = await User.findById(decodedTokenData.id);
  req.currentUser = userRecord;
  if(!userRecord) {
    return res.status(401).end('User not found')
  } else {
    return next();
  }
};

module.exports = attach_user;