var express = require('express');
var router = express.Router();
var foodiesCtrl = require('../controllers/foodies');

/* GET users listing. */
router.get('/foodies', foodiesCtrl.index);
router.get('/foodies/new', isLoggedIn, foodiesCtrl.new);
router.get('/foodies/my-posts', isLoggedIn, foodiesCtrl.ownPosts);
router.post('/foodies', foodiesCtrl.create);

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  //if not logged in -> redirect to log-in
  res.redirect('/auth/google');
}

module.exports = router;
