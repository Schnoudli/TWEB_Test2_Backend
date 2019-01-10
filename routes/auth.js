const express = require('express');
const passport = require('passport');
const passportLocal = require('passport-local');
const passportJWT = require('passport-jwt');
const jwt = require('jsonwebtoken');
const DBAccess = require('../src/DBAccess');
const { jwtOptions } = require('../config');

// Créer un objet pour communiquer avec la DB
const db = new DBAccess();

const USER = {
  id: '123456789',
  email: 'admin@example.com',
  username: 'admin',
  password: 'admin',
};

// Import des stratégies locales, JWT et comment extraire le JWT de la requête
const router = express.Router();
const LocalStrategy = passportLocal.Strategy;
const JWTStrategy = passportJWT.Strategy;
const ExtractJwt = passportJWT.ExtractJwt;

// On utilise une straégie LocalStrategy
passport.use(new LocalStrategy(
  {
    usernameField: 'username',
    passwordField: 'password',
  },
  (username, password, done) => {
    // Faire l'accès en DB ICI ! Comme ça a merdé avec les Movies, je laisse ça 
    if (username === USER.username && password === USER.password) {
      // Null = pas d'erreur
      return done(null, USER);
    }
    // Pas d'erreur mais pas de User non plus
    return done(null, false);
  },
));

// On utilise une stratégie JWTStrategy (lorsqu'on tranmset un JWT et non pas un username/passwd)
passport.use(new JWTStrategy(
  {
    secretOrKey: jwtOptions.secret,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  },
  (jwtPayload, done) => {
    const { userId } = jwtPayload;
    if (userId !== USER.id) {
      return done(null, false);
    }
    return done(null, USER);
  },
));

// On utilise pas de session (stateless)
// Renvoit l'utilisateur ainsi que le token
// Pour tester : curl -X POST -H "Content-type: application/json" -d '{"username": "admin", "password": "admin"}' http://localhost:4000/auth/login
router.post('/login', passport.authenticate('local', { session: false }), (req, res) => {
  const { password, ...user } = req.user;
  const token = jwt.sign({ userId: user.id }, jwtOptions.secret);
  res.send({ user, token });
});

// Récupère les paramètres envoyés pour s'enregistrer et les insère en DB
router.post('/register', (req, res) => {
  const { username, password } = req.body;

  db.insertUser(username, password);

  // TODO : Check if no error
  res.send('Registered');
  res.status('201');
});

module.exports = router;
