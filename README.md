# Backend REST API for a boardgames review site
Project is an **express** application with routing for endpoints listed at the link below. Using a model-view-controller pattern, the server handles requests and for most valid routes will query a postgreSQL database to perform the desired action and provide a response that may be data or a feedback message. 
\
\
Endpoints are also provided with handling for a variety of possible errors e.g. invalid data type provided for parametric endpoints.
\
\
Finally, the project is hosted as a heroku app with access to a production database.

## link to hosted version:
*https://kierans-be-nc-games.herokuapp.com/api*

# How to setup and run locally

## 1. Clone repository down to local machine

In your shell, run following command inside the desired parent directory of the repo \
`git clone https://github.com/kieranjoyce/be-nc-games.git`

## 2. Install project dependencies

Change directory into the repo directory \
`cd be-nc-games` \
install dependencies with node package manager \
`npm install`

## 3. Set PGDATABASE environment variable

Create 2 files:

- .env.test
- .env.development

Inside these files, set PGDATABASE environment variable to your test and development databases, respectively, with the following syntax:

// inside .env.test: \
`PGDATABASE=nc_games_test`

// inside .env.development:\
`PGDATABASE=nc_games`

an example is shown in the .env-example file

## 4. Setup local databases

Run the following script in your shell to create the test and development databases:\
`npm run setup-dbs`

## 5. Seed development database

To seed the development database with initial data, run:\
`npm run seed`\
'development' should be logged to the console during execution of this command

## development uses

## testing uses