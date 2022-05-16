# How to run

## Set PGDATABASE environment variable

with dotenv package installed, create 2 files:

- .env.test
- .env.development

Inside these files, set PGDATABASE environment variable to your test and development databases, respectively, with the following syntax:

    PGDATABASE=<database_name>

an example is shown in the .env-example file