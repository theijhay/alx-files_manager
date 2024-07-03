/* eslint-disable import/no-named-as-default */
/* eslint-disable no-unused-vars */
import sha1 from 'sha1';
import { Request } from 'express';
import mongoDBCore from 'mongodb/lib/core';
import dbClient from './db';
import redisClient from './redis';

export const getUserFromAuthorization = async (req) => {
  const authorization = req.headers.authorization || null;

  if (!authorization) {
    return null;
  }
  const authorizationParts = authorization.split(' ');

  if (authorizationParts.length !== 2 || authorizationParts[0] !== 'Basic') {
    return null;
  }
  const tken = Buffer.from(authorizationParts[1], 'base64').toString();
  const sepPos = tken.indexOf(':');
  const email = tken.substring(0, sepPos);
  const password = tken.substring(sepPos + 1);
  const user = await (await dbClient.usersCollection()).findOne({ email });

  if (!user || sha1(password) !== user.password) {
    return null;
  }
  return user;
};

export const getUserFromXToken = async (req) => {
  const tken = req.headers['x-token'];

  if (!tken) {
    return null;
  }
  const uId = await redisClient.get(`auth_${tken}`);
  if (!uId) {
    return null;
  }
  const user = await (await dbClient.usersCollection())
    .findOne({ _id: new mongoDBCore.BSON.ObjectId(uId) });
  return user || null;
};

export default {
  getUserFromAuthorization: async (req) => getUserFromAuthorization(req),
  getUserFromXToken: async (req) => getUserFromXToken(req),
};
