import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class EventsGateway {
    private logger = new Logger('EventsGateway');

    emitToUser(userId: string, event: string, data: any) {
        this.logger.log(`[Vercel] Emit to user ${userId}: ${event}`);
    }

    broadcastToAll(event: string, data: any) {
        this.logger.log(`[Vercel] Broadcast: ${event}`);
    }

    emitToRoom(room: string, event: string, data: any) {
        this.logger.log(`[Vercel] Emit to room ${room}: ${event}`);
    }
}
