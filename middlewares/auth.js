/* eslint-disable no-unused-vars */
import { Request, Response, NextFunction } from 'express';
import { getUserFromXToken, getUserFromAuthorization } from '../utils/auth';

export const basicAuthenticate = async (req, res, next) => {
  const us = await getUserFromAuthorization(req);

  if (!us) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  req.user = us;
  next();
};

export const xTokenAuthenticate = async (req, res, next) => {
  const us = await getUserFromXToken(req);

  if (!us) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  req.us = us;
  next();
};
