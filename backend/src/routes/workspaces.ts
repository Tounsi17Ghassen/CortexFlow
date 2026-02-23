import { Router } from 'express';
import passport from 'passport';
import { body, param, validationResult } from 'express-validator';
import Workspace from '../models/Workspace';
import Page from '../models/Page';

const router = Router();

// Get all workspaces for the current user
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req: any, res: any, next: any) => {
    try {
      const workspaces = await Workspace.find({
        members: (req.user as any).id,
      }).populate('owner', 'name email');
      res.json(workspaces);
    } catch (error) {
      next(error);
    }
  }
);

// Create workspace
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  [body('name').notEmpty()],
  async (req: any, res: any, next: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { name, description } = req.body;
      const userId = (req.user as any).id;
      const workspace = new Workspace({
        name,
        description,
        owner: userId,
        members: [userId],
      });
      await workspace.save();
      res.status(201).json(workspace);
    } catch (error) {
      next(error);
    }
  }
);

// Get workspace by ID
router.get(
  '/:workspaceId',
  passport.authenticate('jwt', { session: false }),
  param('workspaceId').isString(),
  async (req: any, res: any, next: any) => {
    try {
      const { workspaceId } = req.params;
      const workspace = await Workspace.findById(workspaceId)
        .populate('owner', 'name email')
        .populate('members', 'name email');
      if (!workspace) {
        return res.status(404).json({ error: 'Workspace not found' });
      }
      res.json(workspace);
    } catch (error) {
      next(error);
    }
  }
);

// Get pages in a workspace
router.get(
  '/:workspaceId/pages',
  passport.authenticate('jwt', { session: false }),
  param('workspaceId').isString(),
  async (req: any, res: any, next: any) => {
    try {
      const { workspaceId } = req.params;
      const pages = await Page.find({
        workspace: workspaceId,
        archived: false,
        parent: null,
      }).populate('lastEditedBy', 'name');
      res.json(pages);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
