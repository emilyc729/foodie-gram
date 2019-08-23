const Foodie = require('../models/foodie');

module.exports = {
    index
}

function index(req, res, next) {
    console.log(req.user);
    res.render('foodies/index', {
        user: req.user,
        name: req.query.name
    });
}