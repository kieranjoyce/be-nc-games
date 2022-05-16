const express = require('express');
const { getCategories } = require('./controllers/games.controller');

const app = express();

app.use(express.json());

app.get('/api/categories', getCategories);

app.all('/*', (req, res, next) => {
    res.status(404).send({msg: 'route not found'})
})

module.exports = app;