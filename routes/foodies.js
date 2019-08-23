var express = require('express');
var router = express.Router();
var foodiesCtrl = require('../controllers/foodies');

/* GET users listing. */
router.get('/foodies', foodiesCtrl.index);

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  //if not logged in -> redirect to log-in
  res.redirect('/auth/google');
}

module.exports = router;
