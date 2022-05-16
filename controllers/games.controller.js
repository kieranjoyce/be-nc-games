const { fetchCategories } = require("../models/games.model");


exports.categoriesHandler = (req, res, next) => {
    if (req.method === 'GET') {
        fetchCategories()
        .then(categories => {
            res.status(200).send({categories});
        })
    } else {
        next({msg: `${req.method} method not supported for this route`, Allow: ['GET']})
    }
};