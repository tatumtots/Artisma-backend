var express = require('express');
var router = express.Router();
const User = require("../models/users");
const passport = require("passport");
const authenticate = require("../authenticate");


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

//Token authentication. Needs a unique email address added as a requirement.
router.post("/signup", (req, res, next) => {
  User.register(
    new User({username: req.body.username}),
    req.body.password,
    err => {
      if(err) {
        res.statusCode = 500;
        res.setHeader("Content-Type", "application/json");
        res.json({err: err});
      } else {
        passport.authenticate("local")(req, res, () => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json({success: true, status: "Artisma Registration Successful"});
        });
      }
    }
  )
});

//requires username and password in the body of the request
router.post("/login", passport.authenticate("local"), (req, res) => {
  const token = authenticate.getToken({_id: req.user._id});
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.json({successs: true, token: token, status: "You are successfully logged in to Artisma"});
});



module.exports = router;
