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

exports.fetchReviews = (sort_by='created_at', order='desc', category) => {
    const queryVals = [];
    
    const validSortBy = ['review_id', 'title', 'category', 'designer', 'owner', 'review_body', 'review_img_url', 'created_at', 'votes']
    const validOrder = ['asc', 'desc']

    let queryStr = `
    SELECT reviews.*, COUNT(comments.comment_id)::INT AS comment_count
    FROM reviews LEFT JOIN comments 
    ON reviews.review_id = comments.review_id
    `

    if(category) {
        const categoryWithSpaces = category.split('_').join(' ');
        queryStr += ' WHERE category = $1'
        queryVals.push(categoryWithSpaces);
    }

    queryStr += ' GROUP BY reviews.review_id'

    if (validSortBy.includes(sort_by)) {
        queryStr += ` ORDER BY ${sort_by} `
    }

    if (validOrder.includes(order.toLowerCase())) {
        queryStr += order.toUpperCase();
    }

    return db.query(queryStr, queryVals)
    .then(({rows : reviews}) => {
        return reviews;
    })
}

exports.fetchComments = (review_id) => {
    return db.query(`
        SELECT * FROM comments
        WHERE review_id = $1
    `, [review_id])
    .then(({rows : comments}) => {
        return comments;
    })
}

exports.addComment = (review_id, username, body) => {
    return db.query(`
        INSERT INTO comments
        (review_id, author, body)
        VALUES ($1, $2, $3)
        RETURNING *;
    `, [review_id, username, body])
    .then(({rows : [comment]}) => {
        return comment;
    })
}