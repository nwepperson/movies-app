var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Movie = require('../models/movie');
var omdb = require('omdb');


var authenticate = function(req, res, next) {
  if(!req.isAuthenticated()) {
    res.redirect('/');
  }
  else {
    next();
  }
}

//INDEX
router.get('/', authenticate, function(req, res, next) {
  //TODO get all the movies and render index
  var currentUser = req.user;
  var movies = global.currentUser.movies;
  res.render('movies/index', { movies: movies, message: req.flash() });
  // Movie.find({})
  // .then(function(movies) {
  //   res.render('movies/index', { movies: movies })
  // }, function(err) {
  //   return next(err);
  // });
});
//ORDER MATTERS!!!!

//NEW
router.get('/new', authenticate, function(req, res, next) {
  var currentUser = req.user;
  var movie = {
    title: '',
    release_year: '',
    description: '',
    photo_url: ''
  };
  res.render('movies/new', { movie: movie, message: req.flash() } );
});

//SEARCH
router.post('/search', authenticate, function(req, res, next) {
  var currentUser = req.user;
  var filter = req.body.search;
  omdb.search(filter, function(err, movies) {
    if(err) {
        return console.error(err);
    }

    if(movies.length < 1) {
        return console.log('No movies were found!');
    }
  res.render('movies/search', { movies: movies, message: req.flash() } );
});
});

//ADD
router.post('/add', authenticate, function(req, res, next) {
  if (req.body.add.length > 1) {
    var array = req.body.add;
  }
  else {
    var array = [req.body.add];
  };
  console.log(array);
  var currentUser = req.user;
  for (i = 0; i < array.length; i++) {
    omdb.get({ title: array[i] }, true, function(err, film) {
      if(err) {
          return console.error(err);
      }

      if(!film) {
          return console.log('Movie not found!');
      }
      var movie = {
      title: film.title,
      release_year: film.year,
      description: film.plot,
      photo_url: film.poster
      };
  currentUser.movies.push(movie);
  currentUser.save()
  .then(function() {
  }, function(err) {
    return next(err);
  });
  });
  };
  console.log(global.currentUser.movies);
  res.redirect('/movies');
});

//SHOW
router.get('/:id', authenticate, function(req, res, next) {
  var currentUser = req.user;
  var movie = currentUser.movies.id(req.params.id);
  if (!movie) return next(makeError(res, 'Document not found', 404));
  res.render('movies/show', { movie: movie, message: req.flash() } );
  // Movie.findById(req.params._id)
  // .then(function(movie) {
  //   res.render('movies/show', { movie: movie });
  // }, function(err) {
  //   return next(err);
  // });
});

// CREATE
router.post('/', authenticate, function(req, res, next) {
  var currentUser = req.user;
  var movie = {
    title: req.body.title,
    release_year: req.body.release_year,
    description: req.body.description,
    photo_url: req.body.photo_url
  };
  currentUser.movies.push(movie);
  currentUser.save()
  .then(function() {
    res.redirect('/movies');
  }, function(err) {
    return next(err);
  });
});

//EDIT
router.get('/:id/edit', authenticate, function(req, res, next) {
  var currentUser = req.user;
  var movie = currentUser.movies.id(req.params.id);
  if (!movie) return next(makeError(res, 'Document not found', 404));
  var checked = movie.completed ? 'checked' : '';
  res.render('movies/edit', { movie: movie, checked: checked, message: req.flash() } );
});

// UPDATE
router.put('/:id', authenticate, function(req, res, next) {
  var currentUser = req.user;
  var movie = currentUser.movies.id(req.params.id);
  if (!movie) return next(makeError(res, 'Document not found', 404));
  else {
    movie.title = req.body.title;
    movie.release_year = req.body.release_year;
    movie.description = req.body.description;
    movie.photo_url = req.body.photo_url;
    currentUser.save()
    .then(function(saved) {
      res.redirect('/movies');
    }, function(err) {
      return next(err);
    });
  }
});

// DESTROY
router.delete('/:id', authenticate, function(req, res, next) {
  var currentUser = req.user;
  var movie = currentUser.movies.id(req.params.id);
  if (!movie) return next(makeError(res, 'Document not found', 404));
  var index = currentUser.movies.indexOf(movie);
  currentUser.movies.splice(index, 1);
  currentUser.save()
  .then(function(saved) {
    res.redirect('/movies');
  }, function(err) {
    return next(err);
  });
});

module.exports = router;
