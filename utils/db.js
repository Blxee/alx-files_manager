import { MongoClient } from 'mongodb';

class DBClient {
  constructor() {
    const { DB_HOST, DB_PORT, DB_DATABASE } = process.env;
    this.alive = false;
    this.client = MongoClient.connect(
      `mongodb://${DB_HOST || 'localhost'}:${DB_PORT || 27017}/${DB_DATABASE || 'files_manager'}`,
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
    return this.client.collection('users').find({}).length;
  }

  async nbFiles() {
    return this.client.collection('files').find({}).length;
  }
}

const dbClient = new DBClient();
export default dbClient;
