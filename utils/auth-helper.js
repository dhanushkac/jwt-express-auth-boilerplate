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

const generateRefreshToken = async (res, payload) => {
  const expiresIn = process.env.REFRESH_TOKEN_EXPIRES;
  const secret = process.env.REFRESH_TOKEN_SECRET;
  const token = await generateToken(payload, secret, { expiresIn });

  const oneDayToSeconds = 24 * 60 * 60;

  return res.cookie('token', token, {
    maxAge: oneDayToSeconds,
    secure: false,
    httpOnly: true,
  });
}

const isAuthenticated = async (req, res, next) => {

  const header = req.headers;
  const token = header.authorization?.split(' ')[1];

  if (!token) {
    res.status(401).send({ status: 'ERROR', message: 'You are not authorized. Check token.' });
  }

  try {
    const decode = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    req.user = {
      email: decode.email
    }

    next();
  } catch (err) {
    res.status(500).send({ status: 'ERROR', message: err.message });
  }
}

const refreshToken = async (req, res) => {
  const token = req.cookies.token || '';
  try {
    if (!token) {
      res.status(401).send({ status: 'ERROR', message: 'You are not authorized. Please log in again.' });
    }

    const decode = await jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    return generateAccessToken({ email: decode.email });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
}

const logout = (req, res) => {
  res.clearCookie('token');
  res.status(200).send({ message: 'Logout success.' });
}

module.exports = { generateAccessToken, generateRefreshToken, isAuthenticated, refreshToken, logout };
