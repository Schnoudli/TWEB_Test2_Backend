require('dotenv/config');
const express = require('express');
const passport = require('passport');
const cors = require('cors');
const { port } = require('./config');
const api = require('./routes/api');
const auth = require('./routes/auth');

const app = express();

// Enable CORS for the client app
app.use(cors());

// Middleware indispensable pour chopper du JSON et initialiser passport
app.use(express.json());
app.use(passport.initialize());

app.use('/api', api);
app.use('/auth', auth);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send('Something went wrong!');
});

app.listen(port, () => {
  console.log(`Magic happens at http://localhost:${port}`);
});