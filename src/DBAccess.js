/* eslint-disable class-methods-use-this */
const mongoose = require('mongoose');

const { Schema } = mongoose;

const movieSchema = new Schema({
  vote_count: Number,
  video: Boolean,
  vote_average: Number,
  title: String,
  popularity: Number,
  poster_path: String,
  original_language: String,
  original_title: String,
  backdrop_path: String,
  adult: Boolean,
  overview: String,
  release_date: String,
  tmdb_id: Number,
  genres: [String],
});

const userSchema = new Schema({
  username: String,
  password: String,
});

class DBAccess {
  constructor() {
    // TODO : Mettre ce commerce dans un .env
    mongoose.connect('mongodb://TWEB:MongoDBTWEB@cluster0-shard-00-00-2mrhf.azure.mongodb.net:27017,cluster0-shard-00-01-2mrhf.azure.mongodb.net:27017,cluster0-shard-00-02-2mrhf.azure.mongodb.net:27017/movie-time?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true');
    this.db = mongoose.connection;
    this.db.on('error', console.error.bind(console, 'connection error:'));
    this.db.once('open', () => {
      console.log('Connected !');
    });

    this.Movies = mongoose.model('Movies', movieSchema);
    this.User = mongoose.model('User', userSchema);
  }

  insertUser(username, password) {
    const User = mongoose.model('User', userSchema);
    const userToInsert = new User({ username, password });

    // TODO : Check if user is already inserted

    userToInsert.save();
  }

  getMovies() {
    // Cette ligne renvoie de la merde et je capte pas pourquoi ...
    // return this.Movies.find();

    // Cette ligne fait aussi de la merde
    // return this.db.collection('movies').find();

    return 'All movies should appear there';
  }

  getMoviesFromPage(number) {
    // Gérer la pagination avec la DB ici. Pour ça il faut pouvoir récupérer ...

    return `All movies from page ${number} should appear there`;
  }

  getUser(username, password) {
    return this.User.find({ username, password });
  }
}

module.exports = DBAccess;
