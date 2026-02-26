import { Socket } from 'socket.io';
import { logger } from '../../utils/logger';
import { Block } from '../../models/Block';
import { Page } from '../../models/Page';

export const handleSync = async (socket: Socket, data: any) => {
  try {
    const { operation, entityType, entityId, data: entityData, version } = data;
    const user = socket.data.user;

    logger.debug(`Sync operation: ${operation} on ${entityType} ${entityId} by user ${user.id}`);

    switch (entityType) {
      case 'block':
        await handleBlockSync(operation, entityId, entityData, user.id, version);
        break;
      case 'page':
        await handlePageSync(operation, entityId, entityData, user.id, version);
        break;
      default:
        throw new Error(`Unknown entity type: ${entityType}`);
    }

    // Acknowledge success
    socket.emit('sync:ack', { entityId, version, success: true });
  } catch (error) {
    logger.error('Sync error:', error);
    socket.emit('sync:error', { message: (error as Error).message });
  }
};

async function handleBlockSync(operation: string, blockId: string, data: any, userId: string, version: number) {
  switch (operation) {
    case 'update':
      await Block.findOneAndUpdate(
        { id: blockId, version: { $lt: version } },
        { ...data, lastEditedBy: userId, version },
        { new: true }
      );
      break;
    case 'delete':
      await Block.findOneAndDelete({ id: blockId });
      break;
    default:
      throw new Error(`Unsupported operation: ${operation}`);
  }
}

async function handlePageSync(operation: string, pageId: string, data: any, userId: string, version: number) {
  // Similar implementation
}