import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';

import { Socket,Server } from 'socket.io';
import { AppService } from './app.service';

@WebSocketGateway()
export class ArticleGateway {
  constructor(private readonly appService: AppService) {}

  @WebSocketServer() server: Server;

  @SubscribeMessage('get-article') 
  async getArticles(client: Socket, payload: any = {}) {
    let articles = await this.appService.getlast10Articles(payload.topic);
    client.server.emit('get-article', articles);
  }
}