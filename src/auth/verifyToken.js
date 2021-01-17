const jwt = require('jsonwebtoken');
const authConfig = require('./authConfig');
const User = require('../models/user.js').User;

async function verify(req, res, next) {
  try {
    const token = req.header('Authorization').replace('Bearer ', '')
    const decoded = jwt.verify(token, authConfig.SECRET)
    const user = await User.findById(decoded.id, {
      password: 0
    });
    if (!user) {
      throw new Error()
    }
    req.token = token
    req.user = user
    next()
  } catch (e) {
    res.status(401).send({
      error: 'Please authenticate.'
    })
  }
}

module.exports = verify;