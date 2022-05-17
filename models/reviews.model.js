const db = require("../db/connection");


exports.fetchReview = (review_id) => {
    return db.query(`
        SELECT * FROM reviews
        WHERE review_id=$1
    `, [review_id])
    .then(({rows : [review]}) => {
        return review;
    })
}