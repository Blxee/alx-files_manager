const { MongoClient } = require('mongodb');

class DBClient {
  constructor() {
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || 27017;
    const database = process.env.DB_DATABASE || 'files_manager';

    this.alive = false;
    this.client = MongoClient.connect(
      `mongodb://${host}:${port}/${database}`,
      (err, db) => {
        if (!err) {
          this.client = db;
          this.alive = true;

          db.createCollection('users');
          db.createCollection('files');
        }
      },
    );
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
}

const dbClient = new DBClient();
module.exports = dbClient;
