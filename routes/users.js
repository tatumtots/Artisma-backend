var express = require('express');
var router = express.Router();
const User = require("../models/users");
const crypto = require("crypto");

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

//New user signup. Requires username, email, and password in the request body. Email must be unique.
router.post("/signup", (req, res, next) => {
  User.findOne({email: req.body.email})
  .then(user => {
    if(user) {
      const err = new Error(`A user already exists for ${req.body.email}. Please sign in or reset password.`);
      err.status = 403;
      return next(err);
    } else {
      const salt = crypto.randomBytes(32).toString("base64");
      crypto.pbkdf2(req.body.password, salt, 100, 32, "sha1", (err, derivedKey) => {
        if(!err) {
          User.create({
            username: req.body.username,
            email: req.body.email,
            salt: salt,
            password: derivedKey
          })
          .then(user => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json({status: "Registration Successful"})
          })
          .catch(err => next(err));
        } else {
          const err = new Error(`Server-side encription error`);
          err.status = 500;
          next(err);
        }
      });
    }
  })
  .catch(err => next(err));
});

module.exports = router;
