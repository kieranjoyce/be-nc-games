const express = require('express');
const { getCategories } = require('./controllers/categories.controller');
const { methodNotAllowedHandler, routeNotFoundHandler, internalServerErrorHandler } = require('./controllers/errors.controller');
const { getReview } = require('./controllers/reviews.controller');

const app = express();

app.use(express.json());

app.route('/api/categories')
    .get(getCategories)
    .all(methodNotAllowedHandler(['GET']));

app.route('/api/reviews/:review_id')
    .get(getReview)
    .all(methodNotAllowedHandler(['GET']));

app.all('/*', routeNotFoundHandler);

app.use(internalServerErrorHandler);

module.exports = app;