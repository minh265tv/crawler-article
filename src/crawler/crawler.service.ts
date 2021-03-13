import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import axios from 'axios';
import { Model } from 'mongoose';
import { Article } from 'src/schemas/article.schema';
import { Topic } from 'src/schemas/topic.schema';
import * as cheerio from 'cheerio';
import * as slug from 'slug';

@Injectable()
export class CrawlerService {
    private readonly logger = new Logger(CrawlerService.name);

    constructor(
        @InjectModel(Article.name) private readonly articleModel: Model<Article>,
        @InjectModel(Topic.name) private readonly topicModel: Model<Topic>,
    ) { }
    public async main(): Promise<void> {
        await this.crawlDanTri();
        await this.crawlVNExpress();
    }

    private async crawlDanTri(): Promise<void> {
        const config = {
            website: 'https://dantri.com.vn',
            topic: {
                tag: '.site-menu__list > li > a',
                skipIndex: [0, 1] // cac the khong phai la topic
            },
            article: {
                tag: '.news-item__title > a',
                description: '.dt-news__sapo > h2',
                content: '.dt-news__content'
            }
        };
        await this.crawlCommon(config);
    }

    private async crawlVNExpress(): Promise<void> {
        const config = {
            website: 'https://vnexpress.net',
            topic: {
                tag: '#wrap-main-nav > nav > ul > li > a',
                skipIndex: [0, 1, 3, 5] // cac the khong phai la topic
            },
            article: {
                tag: '.item-news > h3 > a',
                description: '.description',
                content: '.fck_detail'
            }
        };
        await this.crawlCommon(config);
    }

    private async crawlCommon(config): Promise<void> {
        const website = config.website;
        let pageRes = await axios.get(website);
        let $ = cheerio.load(pageRes.data);
        const topicTag = $(config.topic.tag);
        let topicTitle, topicUrl, articlePagePromise = [], topicsDatabasePromise = [];
        //tim thong tin trong cac the topic
        for (let i = 0; i < topicTag.length; i++) {
            if (config.topic.skipIndex.includes(i)) continue;
            topicTitle = $(topicTag[i]).attr('title');
            if (!topicTitle) continue;
            topicUrl = $(topicTag[i]).attr('href');
            topicUrl = topicUrl.startsWith('http') ? topicUrl : website + topicUrl;
            articlePagePromise.push(axios.get(topicUrl));

            topicsDatabasePromise.push(this.topicModel.findOneAndUpdate({ title: topicTitle }, {
                title: topicTitle,
                slug: slug(topicTitle)
            }, {
                upsert: true,
                setDefaultsOnInsert: true,
                new: true
            }));
        }
        let topicsDatabase = await Promise.all(topicsDatabasePromise);
        let articlePageRes = await Promise.all(articlePagePromise);
        let articleTitle, articleUrl, articleDetails = [], articleDetailsPromise = [];
        //tim thong tin trong cac the article
        for (let i in articlePageRes) {
            $ = cheerio.load(articlePageRes[i].data);
            const articleTags = $(config.article.tag);
            for (let j = 0; j < articleTags.length; j++) {
                articleTitle = $(articleTags[j]).attr('title');
                if (!articleTitle) continue;
                articleUrl = $(articleTags[j]).attr('href');
                articleUrl = articleUrl.startsWith('http') ? articleUrl : website + articleUrl;
                articleDetails.push({
                    articleTitle,
                    articleUrl,
                    topicId: topicsDatabase[i]._id
                })
                articleDetailsPromise.push(axios.get(articleUrl));
            }
        }
        let articleDetailsRes = await Promise.all(articleDetailsPromise);
        let articleDescription, articleContent;
        // xu ly thong tin article va luu vao db
        for (let i in articleDetailsRes) {
            $ = cheerio.load(articleDetailsRes[i].data);
            articleDescription = $($(config.article.description)[0]).text();
            articleContent = $($(config.article.content)[0]).html();
            if(!articleContent) continue;
            this.articleModel.findOneAndUpdate({ title: articleDetails[i].articleTitle }, {
                title: articleDetails[i].articleTitle,
                description: articleDescription,
                content: articleContent.trim(),
                url: articleDetails[i].articleUrl,
                topic: articleDetails[i].topicId
            }, {
                upsert: true,
                setDefaultsOnInsert: true,
                new: true
            }, ((err, doc) => {
                if (err) {
                    this.logger.log('Crawl fail: ' + err);
                } else {
                    this.logger.log('Crawl success: [' + config.website + ']' + doc.title);
                }
            }));
        }
    }
}
