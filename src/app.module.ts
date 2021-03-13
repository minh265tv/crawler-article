import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CrawlerModule } from './crawler/crawler.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import configuration from './config/configuration';
import { Article, ArticleSchema } from './schemas/article.schema';
import { Topic, TopicSchema } from './schemas/topic.schema';
import { ArticleGateway } from './article.gateway';

@Module({
  imports: [
    CrawlerModule, 
    ConfigModule.forRoot({
      load: [configuration]
    }),
    MongooseModule.forRoot(configuration().mongodb.uri),
    MongooseModule.forFeature([
      { name: Article.name, schema: ArticleSchema },
    ]),
    MongooseModule.forFeature([
      { name: Topic.name, schema: TopicSchema },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService , ArticleGateway],
})
export class AppModule {}
