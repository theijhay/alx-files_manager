/* eslint-disable import/no-named-as-default */
import { v4 as uuidv4 } from 'uuid';
import redisClient from '../utils/redis';
import dbClient from '../utils/db';
import sha1 from 'sha1';

export default class AuthController {
  static async getConnect(req, res) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Basic ')) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const encodedCredentials = authHeader.split(' ')[1];
    const decodedCredentials = Buffer.from(encodedCredentials, 'base64').toString('utf-8');
    const [email, password] = decodedCredentials.split(':');

    // Check if user with email and hashed password exists
    const usersCollection = await dbClient.usersCollection();
    const hashedPassword = sha1(password);
    const user = await usersCollection.findOne({ email, password: hashedPassword });

    if (!user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    // Generate token and store in Redis
    const token = uuidv4();
    await redisClient.set(`auth_${token}`, user._id.toString(), 'EX', 24 * 60 * 60);

    res.status(200).json({ token });
  }

  static async getDisconnect(req, res) {
    const token = req.headers['x-token'];

    if (!token) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const result = await redisClient.del(`auth_${token}`);

    if (result === 0) {
      res.status(401).json({ error: 'Unauthorized' });
    } else {
      res.status(204).send();
    }
  }
}
