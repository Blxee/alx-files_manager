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

  createUser(email, password) {
    const hashedPassword = createHash('sha1').update(password).digest('hex');
    this.client.db().collection('users').insertOne({ email, hashedPassword });
  }

  async userExists(email) {
    return Boolean(this.client.db().collection('users').findOne({ email }));
  }
}

const dbClient = new DBClient();
module.exports = dbClient;
