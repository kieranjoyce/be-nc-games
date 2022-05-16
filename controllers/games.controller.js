const { fetchCategories } = require("../models/games.model");


exports.getCategories = (req, res, next) => {
    fetchCategories()
        .then(categories => {
            res.status(200).send({categories});
        });
};

exports.methodNotAllowedHandler = (allowedMethods) => ((req, res, next) => {
    next({status: 405, msg: `${req.method} method not supported for this route`, Allow: allowedMethods})
})