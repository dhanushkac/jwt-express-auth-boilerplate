const express = require('express');
const { config } = require('dotenv');

const { isAuthenticated } = require('./utils/auth-helper');
const { configureApp, configureRoutes } = require('./utils/app-helper');

config();

const app = express();
const port = process.env.PORT || 3000;

configureApp(app);
configureRoutes(app);

app.get('/', (req, res) => {
  res.status(200).contentType('application/json').send({ message: 'Welcome to node auth' });
});

app.get('/restricted', isAuthenticated, (req, res) => {
  res.status(200).send({ message: 'Accessed restricted zone.' });
});

app.all('*', (req, res) => {
  res.status(400).send({ message: 'Invalid Route.' });
});

app.listen(port, () => {
  console.log(`App is running on ${port}`);
});
