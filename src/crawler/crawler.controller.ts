import { Controller, Get, Post } from '@nestjs/common';
import { CrawlerService } from './crawler.service';

@Controller('crawler')
export class CrawlerController {
    constructor(private readonly cralwerService: CrawlerService) {}

    @Post()
    crawl(): object {
        try {
            this.cralwerService.main();
            return {
                success: true,
                message: 'crawling'
            }
        } catch (error) {
            return {
                success: false,
                message: error.message
            }
        }
    }
}
