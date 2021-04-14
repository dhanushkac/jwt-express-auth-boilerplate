const jwt = require('jsonwebtoken');
const { config } = require('dotenv');

config();

const generateToken = (payload, secret, options) => {
  return jwt.sign(payload, secret, options);
}

const generateAccessToken = (payload) => {
  const expiresIn = process.env.ACCESS_TOKEN_EXPIRES;
  const secret = process.env.ACCESS_TOKEN_SECRET;
  return generateToken(payload, secret, { expiresIn });
}

const generateRefreshToken = (res, payload) => {
  const expiresIn = process.env.REFRESH_TOKEN_EXPIRES;
  const secret = process.env.REFRESH_TOKEN_SECRET;
  const token = generateToken(payload, secret, { expiresIn });

  const oneDayToSeconds = 24 * 60 * 60;

  return res.cookie('token', token, {
    maxAge: oneDayToSeconds,
    secure: false,
    httpOnly: true,
  });
}

/**
 * Validate the the request is authenticated. Process the header and verify the token as a middleware.
 *
 * @param req the request
 * @param res the response
 * @param next the next func
 * @returns {Promise<void>}
 */
const isAuthenticated = (req, res, next) => {

  const header = req.headers;
  const token = header.authorization?.split(' ')[1];

  if (!token) {
    res.status(401).send({ status: 'ERROR', message: 'You are not authorized. Check token.' });
  }

  try {
    const decode = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    req.user = {
      email: decode.email
    }

    next();
  } catch (err) {
    res.status(500).send({ status: 'ERROR', message: err.message });
  }
}

/**
 * Handles refreshing of the access token. Request cookies will be used to validate the refresh token.
 *
 * @param req the request
 * @param res the response
 * @returns {Promise<*>}
 */
const refreshToken = (req, res) => {
  const token = req.cookies.token || '';
  try {
    if (!token) {
      res.status(401).send({ status: 'ERROR', message: 'You are not authorized. Please log in again.' });
    }

    const decode = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    return generateAccessToken({ email: decode.email });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
}

/**
 * Handles logout functionality. Removes the refresh token.
 * TODO Persist removed refresh token in DB for future validations
 *
 * @param req the request
 * @param res the response
 */
const logout = (req, res) => {
  res.clearCookie('token');
  res.status(200).send({ message: 'Logout success.' });
}

module.exports = { generateAccessToken, generateRefreshToken, isAuthenticated, refreshToken, logout };
