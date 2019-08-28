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
    updatePost,
    addComment,
    deleteComment
};

function index(req, res, next) {

    Foodie.find({}, function (err, foodies) {
        Foodie.findOne({ '_id': req.user.id }, function (err, foodie) {
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
    Foodie.findOne({ '_id': req.user.id }, function (err, foodie) {
        foodie.posts.forEach(function (onePost, idx) {
            if (req.params.id === onePost.id) {
                foodie.posts.splice(idx, 1);
                foodie.save(function (err) {
                    res.redirect('foodies/profile');
                });
            }
        });
    });
}

function editPost(req, res, next) {
    Foodie.findOne({ '_id': req.user.id }, function (err, foodie) {
        foodie.posts.forEach(function (onePost) {
            if (req.params.id === onePost.id) {

                res.render('foodies/edit-post', {
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
    Foodie.findOne({ '_id': req.user.id }, function (err, foodie) {
        foodie.posts.forEach(function (onePost) {
            if (req.params.id === onePost.id) {

                onePost.photo = req.body.photo != '' ? req.body.photo : onePost.photo;
                onePost.caption = req.body.caption != '' ? req.body.caption: onePost.caption;
                onePost.restaurantName = req.body.restaurantName != '' ? req.body.restaurantName : onePost.restaurantName;
                onePost.restaurantAddr = req.body.restaurantAddr != '' ? req.body.restaurantAddr : onePost.restaurantAddr;
                onePost.cuisine = req.body.cuisine != '' ? req.body.cuisine: onePost.cuisine;
                onePost.rating = req.body.rating != null ? req.body.rating : onePost.rating;
                foodie.save(function (err) {
                    res.redirect('foodies/profile');


                });
            }
        });
    });
}

function addComment(req, res, next) {

    Foodie.find({}, function(err, foodies) {
        foodies.forEach(function(foodie) {
            foodie.posts.forEach(function(onePost) {
                if(onePost.id === req.params.id) {
                    req.body.username = req.user.username;
                    onePost.comments.push(req.body);
                    console.log('-------------');

                    foodie.save(function(err){
                        foodie.comments.push(onePost.comments[onePost.comments.length - 1]);
                        foodie.save(function(err) {
                            console.log(foodie.comments);
                            res.redirect(`/foodies/${req.params.id}`);
                        });
                    });
                }
            });
        });
    });
}

function deleteComment(req, res, next) {
    Foodie.find({}, function(err, foodies) {
        foodies.forEach(function(foodie) {
            foodie.posts.forEach(function(onePost) {
                onePost.comments.forEach(function(c, idx) {
                    if(req.params.id === c.id) {

                        onePost.comments.splice(idx,1);
                        foodie.comments.splice(foodie.comments.indexOf(c),1);
                        foodie.save(function(err) {
                            console.log(foodie);
                            console.log(onePost);
                            console.log(c);
                            res.redirect(`/foodies/${onePost.id}`);
                        });
                    }
                });
            });
        });
    });
}