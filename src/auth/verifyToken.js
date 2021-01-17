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

async function registeredUser(req, res, next) {

    const authHeader = req.header('Authorization')
    if (!authHeader) {
      req.validUser = false
    }
    else {
      const token = authHeader.replace('Bearer ', '')
      if (!token) {
        req.validUser = false
      }
      else {
        const decoded = jwt.verify(token, authConfig.SECRET)
        if (!decoded) {
          req.validUser = false
        }
        else {
          const user = await User.findById(decoded.id, {
            password: 0
          });
          if (!user) {
            req.validUser = false
          }
          else {
            req.validUser = true
          }
        }
      }
    }
    next()    
}

module.exports = {verify, registeredUser};