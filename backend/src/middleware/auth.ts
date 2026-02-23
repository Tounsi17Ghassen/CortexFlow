import { Request, Response, NextFunction } from 'express';
import passport from 'passport';

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('jwt', { session: false }, (err: any, user: any) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    req.user = user;
    next();
  })(req, res, next);
};

export const requireWorkspaceMember = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const Workspace = require('../models/Workspace').default;
    const { workspaceId } = req.params;
    const userId = (req.user as any).id;

    const workspace = await Workspace.findOne({
      _id: workspaceId,
      members: userId,
    });

    if (!workspace) {
      return res.status(403).json({ error: 'Access denied' });
    }

    next();
  } catch (error) {
    next(error);
  }
};
