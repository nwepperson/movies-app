var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Movie = require('../models/movie');

var authenticate = function(req, res, next) {
  if(!req.isAuthenticated()) {
    res.redirect('/');
  }
  else {
    next();
  }
}

//INDEX
// router.get('/', function(req, res, next) {
//   //TODO get all the movies and render index
//   User.find({})
//   .then(function(users) {
//     res.render('users/index', { users: users })
//   }, function(err) {
//     return next(err);
//   });
// });
//ORDER MATTERS!!!!
//NEW
// router.get('/new', function(req, res, next) {
//   var user = {
//     local : {
//     email: String,
//     password: String
//   },
//   firstName:    { type: String},
//   lastName:   { type: String},
//   movies:    [Movie.schema]
//   };
//   res.render('users/new', { user: user } );
// });

//SHOW
router.get('/:id', authenticate, function(req, res, next) {
  var currentUser = req.user;
  // User.findById(req.params.id)
  if (!currentUser) return next(makeError(res, 'Document not found', 404));
  res.render('./users/show', { user: currentUser, message: req.flash() } );
  }, function(err) {
    return next(err);
  ;
});

// // CREATE
// router.post('/', function(req, res, next) {
//   var user = new User({
//     first_name: req.body.first_name,
//     last_name: req.body.last_name,
//   });
//   user.save()
//   .then(function(saved) {
//     res.redirect('/users');
//   }, function(err) {
//     return next(err);
//   });
// });

//EDIT
router.get('/:id/edit', authenticate, function(req, res, next) {
  var currentUser = req.user;
  if (!currentUser) return next(makeError(res, 'Document not found', 404));
  var checked = currentUser.completed ? 'checked' : '';
  res.render('users/edit', { user: currentUser, checked: checked, message: req.flash() } );
});

// UPDATE
router.put('/:id', authenticate, function(req, res, next) {
  var currentUser = req.user;
  if (!currentUser) return next(makeError(res, 'Document not found', 404));
  else {
    currentUser.firstName = req.body.firstName;
    currentUser.lastName = req.body.lastName;
    console.log('about to save currentUser:', currentUser);
    currentUser.save()
    .then(function(saved) {
      // res.render('./users/show', { user: currentUser, message: req.flash() } );
      res.redirect('/users/' + saved._id);
    }, function(err) {
      return next(err);
    });
  };
});

//DESTROY
router.delete('/:id', authenticate, function(req, res, next) {
  var currentUser = req.user;
  User.findByIdAndRemove(req.params.id)
  .then(function() {
    res.redirect('/users');
  }, function(err) {
    return next(err);
  });
});

module.exports = router;
