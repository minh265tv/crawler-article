<p>
  Crawler tin tức theo chủ đề từ các trang báo sử dụng Nestjs + Mongodb
</p>

## Config app

- Các config được lưu trong file .env
- Sửa .env.example thành .env

## Chạy app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Api

- Api lấy 10 tin mới nhất theo 1 chủ đề: [GET] /article?topic=${topic} (topic format theo slug)
- Api crawl từ các trang báo : [POST] /crawler (Thư mục module api: /src/cralwer)

# Websocket

- Event name lấy 10 tin mới nhất theo 1 chủ đề : ('get-article', {topic: ${topic}})



