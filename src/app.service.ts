import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Article } from './schemas/article.schema';
import { Topic } from './schemas/topic.schema';
import { Types } from 'mongoose'

@Injectable()
export class AppService {
  constructor(
    @InjectModel(Article.name) private readonly articleModel: Model<Article>,
    @InjectModel(Topic.name) private readonly topicModel: Model<Topic>,
  ) { }

  public async getlast10Articles(topicTitle: string = '') {
    let topic = await this.topicModel.findOne({
      slug: { $regex: `.*${topicTitle}.*` }
    });

    if(!topic) return [];
    
    let articles = await this.articleModel.find({
      topic: Types.ObjectId(topic.id)
    }).populate('topic').limit(10).sort({updatedAt: -1});

    return articles;
  }
}
