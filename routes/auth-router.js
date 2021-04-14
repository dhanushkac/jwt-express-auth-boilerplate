const express = require('express');
const authRouter = express.Router();
const { config } = require('dotenv');

const {
  generateAccessToken,
  isAuthenticated,
  generateRefreshToken,
  refreshToken,
  logout
} = require('../utils/auth-helper');

config();

authRouter.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (email === 'hello@example.com' && password === 'hello@123') {
    await generateRefreshToken(res, { email });
    const token = generateAccessToken({ email });
    const message = { status: 'SUCCESS', token }

    return res.status(201).send(message);
  }

  res.status(401).send({ status: 'ERROR', message: 'Invalid email or password' });
});

authRouter.post('/refresh', async (req, res) => {
  const token = await refreshToken(req, res);
  res.send({ status: 'SUCCESS', token });
});

authRouter.post('/logout', isAuthenticated, (req, res) => {
  logout(req, res);
});

module.exports = authRouter;
