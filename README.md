## Questions and answeres

Question: How to change the code to support different file format versions?<br />
Answer: Strategy and factory patterns are well suited for this task. Factory will return a specific file parser module depending on file format.

Question: How will the import system change if in the future we need to get this data from a web API?<br />
Answer: If another microservice is responsible for collection data for us, it can simply push data to the message broker queue. And our microservice can subscribe for this queue and process data when there is some data in the queue.

Question: If in the future it will be necessary to do the calculations using the national bank rate, how could this be added to the system?<br />
Answer: Instead of using rates from file, we can use rates from national bank api. When importing file, our system should make request to national bank api to obtain rates for the period when exchanges were done.

Question: How would it be possible to speed up the execution of requests if the task allowed you to update market data once a day or even less frequently? Please explain all possible solutions you could think of.<br />
Answer: First approach is to put aggregated data in RAM cache when some user make request to endpoint. On the next request API will return data from RAM cache.<br />
Second approach is to make data pipeline in which precalculate all necessary data insights. Aggregate precalculated insights is much faster then calculating normalized sql tables with joins. 

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
