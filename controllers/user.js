const bcrypt = require('bcrypt')

const User = require('../models/user');
const jwt = require('jsonwebtoken');

var passwordValidator = require('password-validator');

//Règles de validation du mot de passe
var schema = new passwordValidator;
schema
.is().min(8)            
.is().max(64)
.has().uppercase()
.has().lowercase()
.has().digits(1)
.has().not().spaces()
.has().not().symbols()

exports.signup = (req, res, next) => {
  if (schema.validate(req.body.password)) {
    bcrypt.hash(req.body.password, 10)
      .then(hash => {
        const user = new User({
          email: req.body.email,
          password: hash
        });
        user.save()
          .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
          .catch(error => res.status(400).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
  } else {
    res.status(400).json({message: "Votre mot de passe doit contenir un minimum de 8 caractères, dont au moins une minuscule, une majuscule et un chiffre. Il ne doit pas dépasser 64 caractères ni contenir d'espace et autres symboles."})
  };
}

exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        return res.status(401).json({ error: 'Utilisateur non trouvé !' });
      }
      bcrypt.compare(req.body.password, user.password)
        .then(valid => {
          if (!valid) {
            return res.status(401).json({ error: 'Mot de passe incorrect !' });
          }
          res.status(200).json({
            userId: user._id,
            token: jwt.sign(
              { userId: user._id },
              'NowThatsAnIncrediblySophisticatedToken',
              { expiresIn: '24h' }
            )
          });
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
  };