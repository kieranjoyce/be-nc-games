const express = require('express');
const { getEndpoints } = require('./controllers/api.controller');
const { getCategories } = require('./controllers/categories.controller');
const { deleteComment } = require('./controllers/comments.controller');
const { methodNotAllowedHandler, routeNotFoundHandler, internalServerErrorHandler, psqlErrorHandler, customErrorHandler } = require('./controllers/errors.controller');
const { getReview, patchReview, getReviews, getComments, postComment } = require('./controllers/reviews.controller');
const { getUsers } = require('./controllers/users.controller');
const cors = require('cors')


const app = express();

app.use(cors());

app.use(express.json());

app.route('/api')
    .get(getEndpoints)

app.route('/api/categories')
    .get(getCategories)
    // .all(methodNotAllowedHandler(['GET']));

app.route('/api/reviews')
    .get(getReviews)

app.route('/api/reviews/:review_id')
    .get(getReview)
    .patch(patchReview);
    // .all(methodNotAllowedHandler(['GET']));

app.route('/api/reviews/:review_id/comments')
    .get(getComments)
    .post(postComment)

app.route('/api/comments/:comment_id')
    .delete(deleteComment)

app.route('/api/users')
    .get(getUsers)

app.all('/*', routeNotFoundHandler);

app.use(psqlErrorHandler, customErrorHandler, internalServerErrorHandler);

module.exports = app;