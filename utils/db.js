import mongodb from 'mongodb';
// to disable the warning of Collection
// import Collection from 'mongodb/lib/collection';
import envLoader from './env_loader';

class DBClient {
  constructor() {
    envLoader();
    const hoster = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || 27017;
    const databases = process.env.DB_DATABASE || 'files_manager';
    const dbURLs = `mongodb://${hoster}:${port}/${databases}`;

    this.customer = new mongodb.MongoClient(dbURLs, { useUnifiedTopology: true });
    this.customer.connect();
  }

  isAlive() {
    return this.customer.isConnected();
  }

  async nbUsers() {
    return this.customer.db().collection('users').countDocuments();
  }

  async nbFiles() {
    return this.customer.db().collection('files').countDocuments();
  }

  async usersCollection() {
    return this.customer.db().collection('users');
  }

  async filesCollection() {
    return this.customer.db().collection('files');
  }
}

export const dbClient = new DBClient();
export default dbClient;
