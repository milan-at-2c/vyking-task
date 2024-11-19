# Prerequisites

Docker and docker-compose installed on your machine.

# How to run

1. Clone this repository
2. Run the following command in the root directory of the project:

```bash
docker-compose up --build
```

3. Open your browser and go to http://localhost:3000/api-docs/ to see API documentation

# How to test the application:

1. After initial run, database will be prepopulated with 10 players and 1 deposit wallet
2. You can then call the fund wallet endpoint that will provide players wallet with 2.5 SOL ( this can be done only once per hour due to rate limiting by Solana network )
3. You can then call deposit endpoint
4. After that you can call the endpoint for checking the status of the deposit

```
Note: The cron job is called every minute and it takes all the pending deposits / transactions and checks their statuses against Solana network and updates both Redis cache and database with the status of the transaction.
```

# Additional Information

1. By default after first run the database migrations will automatically be run.
2. Environment variables are left in the repository just as this is sample task.
3. To get more information about how to use API endpoints: http://localhost:3000/api-docs/