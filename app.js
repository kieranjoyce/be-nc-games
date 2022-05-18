const express = require('express');
const { getCategories } = require('./controllers/categories.controller');
const { methodNotAllowedHandler, routeNotFoundHandler, internalServerErrorHandler, psqlErrorHandler, customErrorHandler } = require('./controllers/errors.controller');
const { getReview, patchReview } = require('./controllers/reviews.controller');
const { getUsers } = require('./controllers/users.controller');

const app = express();

app.use(express.json());

app.route('/api/categories')
    .get(getCategories)
    // .all(methodNotAllowedHandler(['GET']));

app.route('/api/reviews/:review_id')
    .get(getReview)
    .patch(patchReview);
    // .all(methodNotAllowedHandler(['GET']));

app.route('/api/users')
    .get(getUsers)

app.all('/*', routeNotFoundHandler);

app.use(psqlErrorHandler, customErrorHandler, internalServerErrorHandler);

module.exports = app;