// loads environment variables
require('dotenv/config');
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const Github = require('../src/Github');
const mongoose = require('mongoose');
const DBAccess = require('../src/DBAccess');
const passport = require('passport');

const router = express.Router();
const app = express();
const port = process.env.PORT || 3000;

// Créer un objet pour communiquer avec l'API Github
const client = new Github({token: process.env.OAUTH_TOKEN});

// Créer un objet pour communiquer avec la DB
const db = new DBAccess();

// Enable CORS for the client app
app.use(cors());

/**
 * authenticationRequired is a middleware that use the jwt strategy to authenticate
 * the use. If authentication fails, passport will respond with a 401 Unauthorized status.
 * If authentication succeeds, the `req.user` property will be set to the authenticated user.
 */
const authenticationRequired = passport.authenticate('jwt', { session: false });

/**
 * authentication middleware overrides the default behavior of passport. The next handler is
 * always invoked. If authentication fails, the `req.user` property will be set to null.
 * If authentication succeeds, the `req.user` property will be set to the authenticated user.
 * see: http://www.passportjs.org/docs/authenticate/#custom-callback
 */
const authentication = (req, res, next) => {
  return passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err) { next(err) }
    req.user = user || null;
    next();
  })(req, res, next);
}

// Ces deux middleware seront appelés avant d'exécuter la fonction qui retourne Hello World
// En gros c'est exécuté avant d'arriver au endpoint
app.use((req, res, next) => {
  console.log('LOG1');
  next();
})

app.use((req, res, next) => {
  console.log('LOG2');
  next();
})

// Simple Hello World
router.get('/', (req, res, next) => {
  res.send('Hello World!');
  db.insertSomeShit();
});

// Récupère les infos d'un user
router.get('/users/:username', (req, res, next) => {
  client.user(req.params.username)
  .then(user => res.send(user))
  .catch(next);
})


// Récupérer les langauges d'un user
router.get('/languages/:username', (req, res, next) => {
  //res.send(`Hey ${req.params.username}`);
  client.userLanguage(req.params.username)
  .then(user => res.send(user))
  .catch(next);
});

// This endpoint is accessible by authenticated and anonymous users
router.get('/public', authentication, (req, res) => {
  const username = req.user ? req.user.username : 'anonymous';
  res.send({ message: `Hello ${username}, this message is public!` })
})

// Pour tester : curl -H "Authorization: bearer <TOKEN>"" http://localhost:4000/api/private
// Utilise un JWT pour pouvoir accéder => Stratégie JWT
// This endpoint is protected and has access to the authenticated user.
router.get('/private', authenticationRequired, (req, res) => {
  res.send({ message: `Hello ${req.user.username}, only logged in users can see this message!` })
})

// This endpoint is protected and has access to the authenticated user.
router.get('/me', authenticationRequired, (req, res) => {
  res.send({ user: req.user });
})

module.exports = router;