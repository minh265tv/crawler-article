import { Module } from '@nestjs/common';
import { CrawlerService } from './crawler.service';
import { CrawlerController } from './crawler.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Article, ArticleSchema } from 'src/schemas/article.schema';
import { Topic,TopicSchema } from 'src/schemas/topic.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Article.name, schema: ArticleSchema },
      { name: Topic.name, schema: TopicSchema },
    ])
  ],
  providers: [CrawlerService],
  controllers: [CrawlerController]
})
export class CrawlerModule { }
