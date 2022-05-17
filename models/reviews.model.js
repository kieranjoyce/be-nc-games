const db = require("../db/connection");


exports.fetchReview = (review_id) => {
    return db.query(`
        SELECT * FROM reviews
        WHERE review_id=$1
    `, [review_id])
    .then(({rows : [review]}) => {
        if (review) {
            return review;
        } else {
            return Promise.reject({status: 404, msg: `no review found for id: ${review_id}`})
        }
    })
}

exports.updateReview = (review_id, inc_votes) => {
    return db.query(`
        UPDATE reviews
        SET votes = votes + $2
        WHERE review_id = $1
    `, [review_id, inc_votes])
}