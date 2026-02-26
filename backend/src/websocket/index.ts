import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { logger } from '../utils/logger';
import { handleSync } from './handlers/sync';
import { handleCollaboration } from './handlers/collaboration';

export const setupWebSocket = (io: Server) => {
  // Authentication middleware
  io.use(async (socket: Socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication required'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;
      const user = await User.findById(decoded.sub);
      
      if (!user) {
        return next(new Error('User not found'));
      }

      socket.data.user = user;
      next();
    } catch (error) {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket: Socket) => {
    const user = socket.data.user;
    logger.info(`User connected: ${user.email}`);

    // Join workspace rooms
    socket.on('join-workspace', (workspaceId: string) => {
      socket.join(`workspace:${workspaceId}`);
      socket.join(`user:${user.id}`);
      logger.debug(`User ${user.email} joined workspace ${workspaceId}`);
    });

    // Leave workspace
    socket.on('leave-workspace', (workspaceId: string) => {
      socket.leave(`workspace:${workspaceId}`);
    });

    // Handle sync operations
    socket.on('sync:operation', (data) => handleSync(socket, data));
    
    // Handle real-time collaboration
    socket.on('collab:edit', (data) => handleCollaboration(socket, data));

    // Handle presence
    socket.on('presence:update', (data) => {
      socket.broadcast.to(`workspace:${data.workspaceId}`).emit('presence:changed', {
        userId: user.id,
        userName: user.name,
        status: data.status,
        pageId: data.pageId
      });
    });

    // Disconnect
    socket.on('disconnect', () => {
      logger.info(`User disconnected: ${user.email}`);
      socket.broadcast.emit('user:offline', { userId: user.id });
    });
  });
};