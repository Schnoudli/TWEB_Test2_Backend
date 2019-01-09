const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
  login: String,
  avatar_url: String,
  gravatar_id: String,
  html_url: String,
  Company: String,
  blog: String,
  location: String,
  email: String,
  hireable: Boolean,
  bio: String,
  followers: Number,
  following: Number,
  created_at: String,
  updated_at: String,
  TTL: Date,
});

const githubQuerySchema = new Schema({
  userConcerned: { type: String, required: true },
  pageNbr: { type: Number, required: true },
  result: { type: String, required: true },
  TTL: { type: Date, default: Date.now, required: true },
});

class ObjectNotInDBError extends Error {
  constructor(_username, _resource) {
    super(`Error requesting ${_resource} for ${_username}, object not in DB.`);
    this.username = _username;
    this.resource = _resource;
  }
}

class DBAccess {
  constructor() {
    mongoose.connect('mongodb://TWEB:MongoDBTWEB@cluster0-shard-00-00-2mrhf.azure.mongodb.net:27017,cluster0-shard-00-01-2mrhf.azure.mongodb.net:27017,cluster0-shard-00-02-2mrhf.azure.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true');
    this.db = mongoose.connection;
    this.db.on('error', console.error.bind(console, 'connection error:'));
    this.db.once('open', () => {
      console.log('Connected !');
    });

    // this.User = mongoose.model('User', userSchema);
    // this.Followers = mongoose.model('Follower', githubQuerySchema);
    // this.Following = mongoose.model('Following', githubQuerySchema);
    // this.Friends = mongoose.model('Friend', githubQuerySchema);
  }

  // eslint-disable-next-line class-methods-use-this
  insertSomeShit() {
    const db = mongoose.connection;
    const user = {
      a: 'abc',
    };

    db.collection('aaa').insert(user);
  }

  updateUser(_user) {
    const user = _user;
    user.login = user.login.toLowerCase();
    user.TTL = Date.now();
    this.User.findOneAndUpdate({ login: _user.login }, user, { upsert: true }, (err) => {
      if (err) console.log(err);
      else console.log(`${_user.login} saved !`);
    });
  }

  getUser(_username) {
    return this.User.find({ login: _username }).limit(1)
      .then((data) => {
        if (undefined === data || data.length === 0) {
          return [];
        }
        return data;
      });
  }

  getUserAndThrowErrorIfNotExists(_username) {
    return this.getUser(_username)
      .then((d) => {
        if (d.length === 0) throw new ObjectNotInDBError(_username, 'user');
        return d;
      });
  }

  insertFollowers(_username, _followers, _pageNbr) {
    const input = new this.Followers({ userConcerned: _username, pageNbr: _pageNbr, result: JSON.stringify(_followers) });
    input.TTL = Date.now();
    return input.save().then(() => console.log(`Followers of ${_username} (page ${_pageNbr}) saved !`));
  }

  removeFollowers(_username) {
    this.Followers.deleteMany({ userConcerned: _username }, (err) => {
      if (err) console.log(`Error while removing followers of ${_username} : ${err}`);
      else console.log(`Followers of ${_username} deleted !`);
    });
  }

  getFollowers(_username, _pageNbr) {
    return this.Followers.find({ userConcerned: _username, pageNbr: _pageNbr });
  }

  getAllFollowers(_username) {
    return this.Followers.find({ userConcerned: _username });
  }

  insertFollowing(_username, _following, _pageNbr) {
    const input = new this.Following({ userConcerned: _username, pageNbr: _pageNbr, result: JSON.stringify(_following) });
    input.TTL = Date.now();
    return input.save().then(() => console.log(`Following of ${_username} (page ${_pageNbr}) saved !`));
  }

  removeFollowing(_username) {
    this.Following.deleteMany({ userConcerned: _username }, (err) => {
      if (err) console.log(`Error while removing following of ${_username} : ${err}`);
      else console.log(`Following of ${_username} deleted !`);
    });
  }

  getFollowing(_username, _pageNbr) {
    return this.Following.find({ userConcerned: _username, pageNbr: _pageNbr });
  }

  getAllFollowing(_username) {
    return this.Following.find({ userConcerned: _username });
  }
}

module.exports = DBAccess;
