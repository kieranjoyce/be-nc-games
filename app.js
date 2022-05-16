const express = require('express');
const { getCategories, methodNotAllowedHandler } = require('./controllers/games.controller');

const app = express();

app.use(express.json());

app.route('/api/categories')
    .get(getCategories)
    .all(methodNotAllowedHandler(['GET']));

app.all('/*', (req, res, next) => {
    res.status(404).send({msg: 'route not found'})
})

app.use((err, req, res, next) => {
    if (err.status === 405) {
        res.status(405).send({msg: err.msg, Allow: err.Allow});
    }
})

app.use((err, req, res, next) => {
    res.status(500).send({msg: 'internal server error'})
})

module.exports = app;