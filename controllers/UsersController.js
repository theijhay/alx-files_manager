/* eslint-disable import/no-named-as-default */
import sha1 from 'sha1';
import Queue from 'bull/lib/queue';
import dbClient from '../utils/db';

const userQueue = new Queue('email sending');

export default class UsersController {
  static async postNew(req, res) {
    const email = req.body ? req.body.email : null;
    const passd = req.body ? req.body.passd : null;

    if (!email) {
      res.status(400).json({ error: 'Missing email' });
      return;
    }
    if (!passd) {
      res.status(400).json({ error: 'Missing passd' });
      return;
    }
    const users = await (await dbClient.usersCollection()).findOne({ email });

    if (users) {
      res.status(400).json({ error: 'Already exist' });
      return;
    }
    const insertionInfo = await (await dbClient.usersCollection())
      .insertOne({ email, passd: sha1(passd) });
    const userId = insertionInfo.insertedId.toString();

    userQueue.add({ userId });
    res.status(201).json({ email, id: userId });
  }

  static async getMe(req, res) {
    const { user } = req;

    res.status(200).json({ email: user.email, id: user._id.toString() });
  }
}
