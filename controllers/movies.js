const Movie = require('../models/movie');

module.exports.createMovie = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Movie.create({
    name,
    link,
    owner,
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
    movieId
  })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new IncorrectValueError('Переданы некорректные данные при создании карточки.'));
      }
      next(err);
    });
};

// module.exports.likeCard = (req, res) => {
//   Movies.findByIdAndUpdate(
//     req.params.movieId,
//     { $addToSet: { likes: req.user._id } },
//     { new: true },
//   )
//     .then((user) => {
//       if (!user) {
//         // throw new NotFoundError('Фильм не найден.');
//         console.log('Фильм не найден.');
//       }
//       res.send({ data: user });
//     })
//     .catch((err) => {
//       // if (err.name === 'CastError') {
//       //   next(new IncorrectValueError('Переданы некорректные данные для сохранения фильма в избранное.'));
//       // }
//       // next(err);
//       console.log(err);
//     });
// };
