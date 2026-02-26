import { Socket } from 'socket.io';
import { logger } from '../../utils/logger';

interface EditEvent {
  pageId: string;
  blockId: string;
  userId: string;
  operation: 'insert' | 'delete' | 'format';
  position: number;
  text?: string;
  format?: any;
}

export const handleCollaboration = (socket: Socket, data: EditEvent) => {
  const { pageId, blockId, userId, operation, position, text, format } = data;
  
  // Broadcast to all other users on the same page
  socket.broadcast.to(`page:${pageId}`).emit('collab:update', {
    blockId,
    userId,
    operation,
    position,
    text,
    format,
    timestamp: new Date()
  });

  logger.debug(`Collaboration edit on page ${pageId} by user ${userId}`);
};