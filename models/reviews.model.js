const db = require("../db/connection");


exports.fetchReview = (review_id) => {
    return db.query(`
        SELECT reviews.*, COUNT(comments.comment_id)::INT AS comment_count
        FROM reviews LEFT JOIN comments 
        ON reviews.review_id = comments.review_id
        WHERE reviews.review_id=$1
        GROUP BY reviews.review_id;
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
        RETURNING *;
    `, [review_id, inc_votes])
    .then(({rows : [review]}) => {
        if (review) {
            return review;
        } else {
            return Promise.reject({status: 404, msg: `no review found for id: ${review_id}`})
        }
    })
};

exports.fetchReviews = () => {
    return db.query(
        `
        SELECT reviews.*, COUNT(comments.comment_id)::INT AS comment_count
        FROM reviews LEFT JOIN comments 
        ON reviews.review_id = comments.review_id
        GROUP BY reviews.review_id
        ORDER BY created_at DESC;
    `)
    .then(({rows : reviews}) => {
        return reviews;
    })
}