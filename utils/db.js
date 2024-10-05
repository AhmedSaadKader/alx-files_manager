import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

class DBClient {
  constructor() {
    const uri = process.env.DB_URI || `mongodb://${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || '27017'}`;
    const database = process.env.DB_DATABASE || 'files_manager';

    this.client = new MongoClient(uri)
    this.db = this.client.db(database)
    this.connected = false;

    // Connect to the database when instantiated
    this.client.connect()
      .then(() => {
        this.connected = true;
      })
      .catch((error) => {
        this.connected = false;
      });
  }

  isAlive() {
    return this.connected;
  }

  async nbUsers() {
    if (!this.connected) {
      throw new Error('Not connected to the database');
    }
    const usersCollection = this.db.collection('users');
    return usersCollection.countDocuments();
  }

  async nbFiles() {
    if (!this.connected) {
      throw new Error('Not connected to the database');
    }
    const filesCollection = this.db.collection('files');
    return filesCollection.countDocuments();
  }
}

// Export the dbClient instance
const dbClient = new DBClient();
export default dbClient;