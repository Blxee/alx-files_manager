import { MongoClient } from 'mongob';

class DBClient {
  constructor() {
    const { DB_HOST, DB_PORT, DB_DATABASE } = process.env;
    this.client = MongoClient.connect(
      `mongodb://${DB_HOST || 'localhost'}:${DB_PORT || 27017}/${DB_DATABASE || 'files_manager'}`,
    );
  }
}

const dbClient = new DBClient();
