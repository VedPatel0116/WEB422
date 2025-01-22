const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const movieSchema = new Schema({
  plot: String,
  genres: [String],
  runtime: Number,
  cast: [String],
  num_mflix_comments: Number,
  poster: String,
  title: String,
  fullplot: String,
  languages: [String],
  released: Date,
  directors: [String],
  rated: String,
  awards: {
    wins: Number,
    nominations: Number,
    text: String
  },
  lastupdated: Date,
  year: Number,
  imdb: {
    rating: Number,
    votes: Number,
    id: Number
  },
  countries: [String],
  type: String,
  tomatoes: {
    viewer: {
      rating: Number,
      numReviews: Number,
      meter: Number
    },
    dvd: Date,
    lastUpdated: Date
  }
}
);

module.exports = class MoviesDB {
  constructor() {
    this.Movie = null;
  }

  initialize(connectionString) {
    return new Promise((resolve, reject) => {
        const db = mongoose.createConnection(connectionString);

        db.on('error', (err) => {
            console.error('Database connection error:', err);
            reject(err);
        });

        db.once('open', () => {
            console.log('Database connection successful!');
            this.Movie = db.model("movies", movieSchema);
            if (!this.Movie) {
                console.error('Movie model is not initialized!');
            } else {
                console.log('Movie model initialized successfully.');
            }
            resolve();
        });
    });
}

async addNewMovie(data) {
    const newMovie = new this.Movie(data);
    await newMovie.save();
    return newMovie;
  }

  getAllMovies(page, perPage, title) {
    const findBy = title ? { title: { $regex: title, $options: "i" } } : {};
    if (!page || isNaN(page) || +page <= 0 || !perPage || isNaN(perPage) || +perPage <= 0) {
      return Promise.reject(new Error('page and perPage query parameters must be valid numbers'));
    }
    return this.Movie.find(findBy)
      .sort({ year: 1 })
      .skip((page - 1) * perPage)
      .limit(+perPage)
      .exec();
  }
  

  getMovieById(id) {
    return this.Movie.findOne({ _id: id }).exec();
  }

  updateMovieById(data, id) {
    return this.Movie.updateOne({ _id: id }, { $set: data }).exec();
  }

  deleteMovieById(id) {
    return this.Movie.deleteOne({ _id: id }).exec();
  }
} 