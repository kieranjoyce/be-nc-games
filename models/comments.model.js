const db = require("../db/connection")

exports.removeComment = (comment_id) => {
    return db.query(`
        DELETE FROM comments 
        WHERE comment_id=$1
        RETURNING *;
    `, [comment_id])
    .then(({ rows : deletedComment}) => {
        if (deletedComment.length === 0) {
            return Promise.reject({status:404, msg: `no comment found for id: ${comment_id}`})
        }
    })
}