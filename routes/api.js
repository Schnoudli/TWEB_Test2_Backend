// loads environment variables
require('dotenv/config');
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const mongoose = require('mongoose');
const DBAccess = require('../src/DBAccess');
const passport = require('passport');

const router = express.Router();
const app = express();
const port = process.env.PORT || 3000;

// Enable CORS for the client app
app.use(cors());

// Créer un objet pour communiquer avec la DB
const db = new DBAccess();

// Renvoie tous les films
router.get('/movies', (req, res, next) => {
  res.send(db.getMovies());
});

// Récupère les films de la page "number"
router.get('/movies/:number', (req, res, next) => {
  res.send(db.getMoviesFromPage(req.param.number));
});

module.exports = router;