## How to start

```bash
# 1. Install dependencies
$ npm install

# 2. Change database url in .env

# 3. Run database migrations
$ npx prisma migrate dev

# 4. Start
$ npm run start
```

## How to upload file to the system
Make request to http://localhost:3000/exchange-offices/upload with form-data as body. Form-data must have field "file" filled as file with exchanges data. You can use sample file called "exchanges" on the root of repository folder.
![Screenshot from 2023-10-24 16-25-32](https://github.com/vipe4ka-visko4ka/test-currency/assets/61078421/f47b7cdc-0966-4e42-be60-5a4c74978d39)

## How to get aggregated exchange offices
Make request to http://localhost:3000/exchange-offices/top
![Screenshot from 2023-10-24 16-27-24](https://github.com/vipe4ka-visko4ka/test-currency/assets/61078421/28b0fc79-e550-418f-b2ae-898d8519ce78)
