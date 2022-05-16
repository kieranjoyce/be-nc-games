const { fetchCategories } = require("../models/games.model");


exports.getCategories = (req, res, next) => {
    fetchCategories()
    .then(categories => {
        res.status(200).send({categories});
    })
};