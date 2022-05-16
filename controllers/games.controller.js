const { fetchCategories, fetchReview } = require("../models/games.model");


exports.getCategories = (req, res, next) => {
    fetchCategories()
        .then(categories => {
            res.status(200).send({categories});
        });
};

exports.getReview = (req, res, next) => {
    const {review_id} = req.params;
    fetchReview(review_id)
        .then(review => {
            res.status(200).send({ review });
        })
        .catch(err => {
            console.log(err);
        })
}

exports.methodNotAllowedHandler = (allowedMethods) => ((req, res, next) => {
    next({status: 405, msg: `${req.method} method not supported for this route`, Allow: allowedMethods})
})