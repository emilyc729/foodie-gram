var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var commentSchema = new Schema({
    response: String,
    required: true
}, {
    timestamps: true
});

var postSchema = new Schema({
    photo: {
        data: Buffer,
        contentType: String,
        required: true
    }, 
    caption: String,
    restaurantName: String,
    restaurantAddr: String,
    cuisines: 
    /*[{type: Schema.Types.ObjectId, ref: 'Cuisine'}],*/
    {
        type: String,
        enum: ['American', 'Asian', 'Mexican', 'Italian', 'Middle Eastern', 'Thai', 'French', 'Japanese', 'Other']
    }, 
    rating: {
        type: Number, 
        min: 0,
        max: 5
    }, 
    comments: [commentSchema]
}, {
    timestamps: true
});

var userSchema = new Schema({
    name: String,
    emial: String,
    avatar: String,
    googleId: String, 
    posts: [postSchema],
    comments: [commentSchema]
},  {
    timestamps: true
});


module.exports = mongoose.model('User', userSchema);