import { Controller, Get, Query } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/article')
  async getArticle(@Query() query): Promise<object> {
    try {
      let articles = await this.appService.getlast10Articles(query.topic);
      return {
        success: true,
        data: articles
      }
    } catch (error) {
      return {
        success: false,
        message: error.message
      }
    }
     
  }
}
