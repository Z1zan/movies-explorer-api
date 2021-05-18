const Movie = require('../models/movie');

const IncorrectValueError = require('../errors/incorrectValueError');
const NotFoundError = require('../errors/notFoundError');
const ForbiddenError = require('../errors/forbiddenError');

module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;

  const owner = req.user._id;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner,
  })
    .then((movie) => res.send({ data: movie }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new IncorrectValueError('Переданы некорректные данные при создании фильма.'));
      } else {
        next(err);
      }
    });
};

module.exports.getMovies = (req, res, next) => {
  Movie.find({})
    .populate('movie')
    .then((movies) => res.send({ data: movies }))
    .catch(next);
};

module.exports.deleteMovieById = (req, res, next) => {
  const { movieId } = req.params;
  Movie.findById(movieId)
    .then(async (movie) => {
      if (!movie) {
        throw new NotFoundError('Фильм не найден.');
      }
      if (req.user._id === String(movie.owner)) {
        try {
          await Movie.findByIdAndDelete(movieId);
          res.send({ message: 'Фильм успешно удален' });
        } catch (err) {
          throw new ForbiddenError('У вас нет доступа для удаления данной фильма');
        }
      } else {
        throw new ForbiddenError('У вас нет доступа для удаления данной фильма');
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new IncorrectValueError('Переданы некорректные данные для удаления фильма.'));
      } else {
        next(err);
      }
    });
};
