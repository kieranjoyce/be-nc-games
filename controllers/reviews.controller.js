const { fetchReview, updateReview } = require("../models/reviews.model");

exports.getReview = (req, res, next) => {
    const {review_id} = req.params;
    fetchReview(review_id)
        .then(review => {
            res.status(200).send({ review });
        })
        .catch(err => {
            next(err);
        })
}

exports.patchReview = (req, res, next) => {
    const {review_id} = req.params;
    const {inc_votes} = req.body;

    if (!inc_votes) {
        next({status: 400, msg: 'request must have inc_votes property'});
    };
    if (Object.keys(req.body).length > 1) {
        next({status: 400, msg: 'request must only have inc_votes property'});
    }


    updateReview(review_id, inc_votes)
    .then((review) => {
        res.status(200).send({review});
    })
    .catch(next);
}