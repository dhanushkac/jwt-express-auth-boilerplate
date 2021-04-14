const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const authRouter = require('../routes/auth-router');

const configureApp = app => {
  app.use(express.json({ limit: '100mb' }));
  app.use(morgan('combined'));
  app.use(cors());
  app.use(cookieParser());
}

const configureRoutes = app => {
  app.use('/auth', authRouter);
}

module.exports = { configureApp, configureRoutes };
