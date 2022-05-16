# How to run

## Set PGDATABASE environment variable

with dotenv package installed, create 2 files:

- .env.test
- .env.development

Inside these files, set PGDATABASE environment variable to your test and development databases, respectively, with the following syntax:

    .env.test:
    PGDATABASE=nc_games_test

    .env.development:
    PGDATABASE=nc_games

an example is shown in the .env-example file