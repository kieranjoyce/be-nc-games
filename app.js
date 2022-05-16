const express = require('express');
const { categoriesHandler } = require('./controllers/games.controller');

const app = express();

app.use(express.json());

app.all('/api/categories', categoriesHandler);

app.all('/*', (req, res, next) => {
    res.status(404).send({msg: 'route not found'})
})

app.use((err, req, res, next) => {
    if (err.msg && err.Allow) {
        res.status(405).send({msg: err.msg, Allow: err.Allow});
    }
})

app.use((err, req, res, next) => {
    res.status(500).send({msg: 'internal server error'})
})

module.exports = app;