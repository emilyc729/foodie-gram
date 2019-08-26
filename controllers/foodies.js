const Foodie = require('../models/foodie');

module.exports = {
    index,
    create,
    new: newPost,
    ownPosts,
    profile,
    postDetails,
    deletePost,
    editPost,
    updatePost
};

function index(req, res, next) {

    Foodie.find({}, function (err, foodies) {
        Foodie.findOne({ '_id': req.user.id }, function(err, foodie) {
            res.render('foodies/index', {
                foodie,
                foodies,
                user: req.user,
                name: req.query.name
            });
        });
    });
}

function create(req, res, next) {
    req.user.posts.push(req.body);
    req.user.save(function (err) {
        console.log(req.user);
        if (err) return next(err);
        res.redirect('foodies/profile');
    });

}

function newPost(req, res, next) {
    Foodie.findOne({ '_id': req.user.id }, function (err, foodie) {
        res.render('foodies/new-post', {
            foodie, 
            user: req.user,
            name: req.query.name 
        });
    });
}

function ownPosts(req, res, next) {
    console.log(req.user.name);
    Foodie.findOne({ '_id': req.user.id }, function (err, foodie) {
        res.render('foodies/my-posts', {
            foodie,
            user: req.user,
            name: req.query.name
        });
    });


}

function profile(req, res, next) {
    Foodie.findOne({ '_id': req.user.id }, function (err, foodie) {
        res.render('foodies/profile', {
            foodie,
            user: req.user,
            name: req.query.name
        });
    });
}


function postDetails(req, res, next) {
  
    Foodie.find({}, function (err, foodies) {
        foodies.forEach(function (foodie) {
            foodie.posts.forEach(function (onePost) {
                if (onePost.id === req.params.id) {
                    res.render('foodies/details', {
                        foodie,
                        onePost,
                        user: req.user,
                        name: req.query.name
                    });
                }
            });
        });
    });
}

function deletePost(req, res, next) {
    Foodie.findOne({'_id': req.user.id}, function (err, foodie) {
        foodie.posts.forEach(function (onePost) {
            if (req.params.id === onePost.id) {
                foodie.posts.splice(foodie.posts.indexOf(onePost),1);
                foodie.save(function(err) {
                    res.redirect('foodies/profile');
                });  
            }
        });
    });
}

function editPost(req, res, next) {
    Foodie.findOne({'_id': req.user.id}, function (err, foodie) {
        foodie.posts.forEach(function (onePost) {
            if (req.params.id === onePost.id) {
                
                res.render('foodies/edit-post',{
                    foodie,
                    onePost,
                    user: req.user,
                    name: req.query.name
                });
            }
        });
    });
}

function updatePost(req, res, next) {
    Foodie.findOne({'_id': req.user.id}, function (err, foodie) {
        foodie.posts.forEach(function (onePost) {
            if (req.params.id === onePost.id) {
                if(req.body.photo != '' || req.body.caption != '' || req.body.restaurantName != '' ||
                    req.body.restaurantAddr != '' || req.body.cuisine != '' || req.body.rating != '') {
                        onePost.photo = req.body.photo;
                        onePost.caption = req.body.caption;
                        onePost.restaurantName = req.body.restaurantName;
                        onePost.restaurantAddr = req.body.restaurantAddr;
                        onePost.cuisine = req.body.cuisine;
                        onePost.rating = req.body.rating;
                        foodie.save(function(err) {
                            res.redirect('foodies/profile');
                        });
                } else {
                    console.log(onePost);
                }
                console.log(onePost);
  
            }
        });
    });
}