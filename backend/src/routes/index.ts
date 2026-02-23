// backend/src/routes/index.ts
import { authRoutes } from './auth';
import { pageRoutes } from './pages';
import { blockRoutes } from './blocks';
import { workspaceRoutes } from './workspaces';
import { databaseRoutes } from './databases';
import { searchRoutes } from './search';
import { userRoutes } from './users';

export const setupRoutes = (app: any) => {
  app.use('/api/auth', authRoutes);
  app.use('/api/pages', pageRoutes);
  app.use('/api/blocks', blockRoutes);
  app.use('/api/workspaces', workspaceRoutes);
  app.use('/api/databases', databaseRoutes);
  app.use('/api/search', searchRoutes);
  app.use('/api/users', userRoutes);

  // Health check
  app.get('/api/health', (req: any, res: any) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });
};
