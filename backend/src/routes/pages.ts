// backend/src/routes/pages.ts
import express from 'express';
import { body, param, query, validationResult } from 'express-validator';
import passport from 'passport';
import { Page } from '../models/Page';
import { Block } from '../models/Block';
import { io } from '../server';
import { logger } from '../utils/logger';

const router = express.Router();

// Get all pages in workspace
router.get('/workspace/:workspaceId',
  passport.authenticate('jwt', { session: false }),
  param('workspaceId').isString(),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('offset').optional().isInt({ min: 0 }),
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { workspaceId } = req.params;
      const limit = parseInt(req.query.limit as string) || 50;
      const offset = parseInt(req.query.offset as string) || 0;

      const pages = await Page.find({
        workspaceId,
        archived: false
      })
        .sort({ updatedAt: -1 })
        .skip(offset)
        .limit(limit);

      const total = await Page.countDocuments({ workspaceId, archived: false });

      res.json({ pages, pagination: { total, limit, offset } });
    } catch (error) {
      next(error);
    }
  }
);

// Get single page with blocks
router.get('/:pageId',
  passport.authenticate('jwt', { session: false }),
  param('pageId').isString(),
  async (req, res, next) => {
    try {
      const { pageId } = req.params;

      const page = await Page.findById(pageId);
      if (!page) {
        return res.status(404).json({ error: 'Page not found' });
      }

      // Increment view count
      page.properties.views += 1;
      page.properties.lastViewed = new Date();
      await page.save();

      // Get all blocks for this page
      const blocks = await Block.find({
        pageId,
        'properties.hidden': false
      });

      res.json({ page, blocks });
    } catch (error) {
      next(error);
    }
  }
);

// Create page
router.post('/',
  passport.authenticate('jwt', { session: false }),
  body('title').isString().notEmpty(),
  body('workspaceId').isString().notEmpty(),
  body('icon').optional().isString(),
  body('cover').optional().isString(),
  body('parentId').optional().isString(),
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const page = new Page({
        title: req.body.title,
        icon: req.body.icon,
        cover: req.body.cover,
        workspaceId: req.body.workspaceId,
        parentId: req.body.parentId,
        createdBy: (req.user as any).id,
        lastEditedBy: (req.user as any).id,
        blocks: [],
        properties: {
          tags: [],
          authors: [(req.user as any).id],
          views: 0
        }
      });

      await page.save();

      // Emit real-time update
      io.to(`workspace:${page.workspaceId}`).emit('page:created', page);

      res.status(201).json(page);
    } catch (error) {
      next(error);
    }
  }
);

// Update page
router.patch('/:pageId',
  passport.authenticate('jwt', { session: false }),
  param('pageId').isString(),
  body('title').optional().isString(),
  body('icon').optional().isString(),
  body('cover').optional().isString(),
  body('properties').optional().isObject(),
  body('archived').optional().isBoolean(),
  async (req, res, next) => {
    try {
      const { pageId } = req.params;

      const page = await Page.findById(pageId);
      if (!page) {
        return res.status(404).json({ error: 'Page not found' });
      }

      // Update fields
      if (req.body.title) page.title = req.body.title;
      if (req.body.icon !== undefined) page.icon = req.body.icon;
      if (req.body.cover !== undefined) page.cover = req.body.cover;
      if (req.body.properties) {
        page.properties = { ...page.properties, ...req.body.properties };
      }
      if (req.body.archived !== undefined) page.archived = req.body.archived;

      page.lastEditedBy = (req.user as any).id;
      page.version += 1;

      await page.save();

      // Emit real-time update
      io.to(`workspace:${page.workspaceId}`).emit('page:updated', page);

      res.json(page);
    } catch (error) {
      next(error);
    }
  }
);

// Delete page (soft delete)
router.delete('/:pageId',
  passport.authenticate('jwt', { session: false }),
  param('pageId').isString(),
  async (req, res, next) => {
    try {
      const { pageId } = req.params;

      const page = await Page.findById(pageId);
      if (!page) {
        return res.status(404).json({ error: 'Page not found' });
      }

      // Soft delete
      page.archived = true;
      page.lastEditedBy = (req.user as any).id;
      await page.save();

      // Emit real-time update
      io.to(`workspace:${page.workspaceId}`).emit('page:deleted', { pageId });

      res.json({ message: 'Page archived successfully' });
    } catch (error) {
      next(error);
    }
  }
);

export const pageRoutes = router;
