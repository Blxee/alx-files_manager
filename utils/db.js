const { MongoClient } = require('mongodb');
const { createHash } = require('crypto');

class DBClient {
  constructor() {
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || 27017;
    const database = process.env.DB_DATABASE || 'files_manager';

    this.alive = false;
    this.client = new MongoClient(`mongodb://${host}:${port}/${database}`, { useUnifiedTopology: true });
    this.client.connect((err) => {
      if (!err) {
        this.alive = true;
      } else {
        console.log(err);
      }
    });
  }

  isAlive() {
    return this.alive;
  }

  async nbUsers() {
    return this.client.db().collection('users').countDocuments();
  }

  async nbFiles() {
    return this.client.db().collection('files').countDocuments();
  }

  async createUser(email, password) {
    const hashedPassword = createHash('sha1').update(password).digest('hex');
    const newUser = await this.client.db().collection('users').insertOne({ email, password: hashedPassword });
    return { id: newUser.insertedId, email };
  }

  async userExists(email) {
    const value = await this.client.db().collection('users').findOne({ email });
    return Boolean(value);
  }

  async getUser(email, password) {
    const user = await this.client.db().collection('users').findOne({ email });
    const hashedPassword = createHash('sha1').update(password).digest('hex');
    if (user && hashedPassword === user.password) {
      return user;
    }
    return undefined;
  }
}

const dbClient = new DBClient();
module.exports = dbClient;
