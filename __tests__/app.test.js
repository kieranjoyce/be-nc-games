process.env.NODE_ENV = 'test';

const request = require('supertest');
const app = require('../app');
const db = require('../db/connection');
const testData = require('../db/data/test-data');
const seed = require('../db/seeds/seed');


beforeEach(() => seed(testData))

afterAll(() => db.end());

describe('METHOD /not_a_path', () => {
    test('404: responds with msg of route not found', () => {
        return request(app).get('/not_a_path')
        .expect(404)
        .then(({body :{msg}}) => 
            expect(msg).toBe('route not found'));
    });
});

describe('GET /api/categories', () => {
    test('200: responds with array of category objects', () => {
        return request(app).get('/api/categories')
        .expect(200)
        .then(({body : {categories}}) => {
            expect(categories).toHaveLength(4);
            for (let category of categories) {
                expect(category).toMatchObject({
                    slug: expect.any(String),
                    description: expect.any(String)
                })
            }
        })
    });

    // test('405: responds with msg and allowed methods if incorrect method used', () => {
    //     return request(app).post('/api/categories')
    //     .expect(405)
    //     .then(({body}) => {
    //         expect(body).toEqual({
    //             msg : 'POST method not supported for this route',
    //             Allow: ['GET']
    //         });
    //     })
    // });
});

describe('GET /api/reviews', () => {
    test('200: responds with array of review objects', () => {
        return request(app).get('/api/reviews')
        .expect(200)
        .then(({body : {reviews}}) => {
            expect(reviews).toHaveLength(13);
            for(let review of reviews) {
                expect(review).toMatchObject({
                    review_id: expect.any(Number),
                    title: expect.any(String),
                    designer: expect.any(String),
                    owner: expect.any(String),
                    review_img_url: expect.stringContaining('https://'),
                    review_body: expect.any(String),
                    category: expect.any(String),
                    created_at: expect.any(String),
                    votes: expect.any(Number),
                })
            }
        })
    });

    test('200: review objects have comment_count property', () => {
        return request(app).get('/api/reviews')
        .expect(200)
        .then(({body : {reviews}}) => {
            expect(reviews).toHaveLength(13);
            for(let review of reviews) {
                expect(review).toMatchObject({
                    comment_count: expect.any(Number),
                })
            }
        })
    });

    test('200: reviews array should be ordered by date in descending order by default', () => {        
        return request(app).get('/api/reviews')
        .expect(200)
        .then(({body : {reviews}}) => {
            expect(reviews).toBeSortedBy('created_at', {descending: true})
        })
    });

    test('200: reviews array should be sorted by column name passed under sort_by query, in descending order by default', () => {
        return request(app).get('/api/reviews?sort_by=votes')
        .expect(200)
        .then(({body : {reviews}}) => {
            expect(reviews).toBeSortedBy('votes', { descending : true})
        })
    });

    test('200: reviews array should be sorted in order specified by order query', () => {
        return request(app).get('/api/reviews?order=asc')
        .expect(200)
        .then(({body : {reviews}}) => {
            expect(reviews).toBeSortedBy('created_at')
        })
    });

    test('200: reviews array should be filtered by specified category if category query passed', () => {
        return request(app).get('/api/reviews?category=social_deduction')
        .expect(200)
        .then(({body : { reviews }}) => {
            expect(reviews).toHaveLength(11);
            for (let review of reviews) {
                expect(review).toHaveProperty('category', 'social deduction');
            }
        })
    });

    test('200: queries show expected behaviour when chained together', () => {
        return request(app).get('/api/reviews?sort_by=review_id&order=asc&category=social_deduction')
        .expect(200)
        .then(({body : { reviews }}) => {
            expect(reviews).toHaveLength(11);
            expect(reviews).toBeSortedBy('review_id')
            for (let review of reviews) {
                expect(review).toMatchObject({
                    review_id: expect.any(Number),
                    title: expect.any(String),
                    designer: expect.any(String),
                    owner: expect.any(String),
                    review_img_url: expect.stringContaining('https://'),
                    review_body: expect.any(String),
                    category: 'social deduction',
                    created_at: expect.any(String),
                    votes: expect.any(Number),
                })
            }
        })
    });

    test('200: valid category query but no reviews', () => {
        return request(app).get('/api/reviews?category=children\'s games')
        .expect(200)
        .then(({ body : {reviews} }) => {
            expect(reviews).toEqual([])
        })
    })

    test('400: invalid sort_by query', () => {
        return request(app).get('/api/reviews?sort_by=bananas')
        .expect(400)
        .then(({body : {msg}}) => {
            expect(msg).toBe('invalid sort_by query');
        })
    });

    test('400: invalid order query', () => {
        return request(app).get('/api/reviews?order=bananas')
        .expect(400)
        .then(({body : {msg}}) => {
            expect(msg).toBe('invalid order query');
        })
    });

    test('404: non-existent category', () => {
        return request(app).get('/api/reviews?category=bananas')
        .expect(404)
        .then(({body : { msg }}) => {
            expect(msg).toBe('category not found');
        })
    });
});

describe('GET /api/reviews/:review_id', () => {
    test('200: responds with specified review', () => {
        return request(app).get('/api/reviews/2')
        .expect(200)
        .then(({body: {review}}) => {
            expect(review).toMatchObject({
                review_id: 2,
                title: 'Jenga',
                designer: 'Leslie Scott',
                owner: 'philippaclaire9',
                review_img_url:
                    'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
                review_body: 'Fiddly fun for all the family',
                category: 'dexterity',
                created_at: '2021-01-18T10:01:41.251Z',
                votes: 5
            })
        })
    });

    test('200: review object has commentCount property of number of comments with that review_id', () => {
        return request(app).get('/api/reviews/2')
        .expect(200)
        .then(({body: {review}}) => {
            expect(review).toHaveProperty('comment_count', 3);
        })
    });

    test('400: responds with error message when incorrect data type used', () => {
        return request(app).get('/api/reviews/bananas')
        .expect(400)
        .then(({body: {msg}}) => {
            expect(msg).toBe('invalid data type')
        })
    });

    test('404: responds with error message when no data found for passed review_id', () => {
        return request(app).get('/api/reviews/-2')
        .expect(404)
        .then(({body: {msg}}) => {
        expect(msg).toBe('no review found for id: -2')
    })
    });

    // test('405: responds with error message and allowed methods if invalid method used', () => {
    //     return request(app).post('/api/reviews/4')
    //     .expect(405)
    //     .then(({body}) => {
    //         expect(body).toEqual({
    //             msg : 'POST method not supported for this route',
    //             Allow: expect.arrayContaining(['GET'])
    //         });
    //     })
    // });
});

describe('PATCH /api/reviews/:review_id', () => {
    test('200: responds with review containing updated vote property', () => {
        return request(app).patch('/api/reviews/2')
        .send({inc_votes: 17})
        .expect(200)
        .then(({body : {review}}) => {
            expect(review).toEqual({
                review_id: 2,
                title: 'Jenga',
                designer: 'Leslie Scott',
                owner: 'philippaclaire9',
                review_img_url:
                    'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
                review_body: 'Fiddly fun for all the family',
                category: 'dexterity',
                created_at: '2021-01-18T10:01:41.251Z',
                votes: 22
            })
        })
    });

    test('404: responds with error message when no data found for passed review_id', () => {
        return request(app).patch('/api/reviews/600')
        .send({inc_votes: 2})
        .expect(404)
        .then(({body: {msg}}) => {
        expect(msg).toBe('no review found for id: 600')
    })
    });
    
    test('400: responds with error message when invalid data type for review_id', () => {
        return request(app).patch('/api/reviews/bananas')
        .send({inc_votes: 62})
        .expect(400)
        .then(({body: {msg}}) => {
            expect(msg).toBe('invalid data type')
        })
    });
    
    test('400: responds with error message when invalid data type input for inc_votes', () => {
        return request(app).patch('/api/reviews/4')
        .send({inc_votes: true})
        .expect(400)
        .then(({body: {msg}}) => {
            expect(msg).toBe('invalid data type')
        })
    });

    test('400: responds with error message if inc_votes property not on req body', () => {
        return request(app).patch('/api/reviews/4')
        .send({ bananas: 'bananas' })
        .expect(400)
        .then(({body: {msg}}) => {
            expect(msg).toBe('request must have inc_votes property');
        })
    });

    test('400: responds with error message if any property other than inc_votes on req body', () => {
        return request(app).patch('/api/reviews/4')
        .send({ inc_votes: 20, bananas: 'bananas' })
        .expect(400)
        .then(({body: {msg}}) => {
            expect(msg).toBe('request must only have inc_votes property');
        })
    });
});

describe('GET /api/reviews/:review_id/comments', () => {
    test('200: returns comments array with correct review_id property', () => {
        return request(app).get('/api/reviews/3/comments')
        .expect(200)
        .then(({body: {comments}}) => {
            expect(comments).toHaveLength(3);
            for(let comment of comments) {
                expect(comment).toMatchObject({
                    comment_id: expect.any(Number),
                    body : expect.any(String),
                    review_id : 3,
                    author : expect.any(String),
                    votes: expect.any(Number),
                    created_at: expect.any(String)
                })
            }
        })
    }); 

    test('404: responds with error message if passed review_id that does not correspond to a review', () => {
        return request(app).get('/api/reviews/60/comments')
        .expect(404)
        .then(({body: {msg}}) => {
            expect(msg).toBe('no review found for id: 60')
        });
    });

    test('400: responds with error message when invalid data type for review_id', () => {
        return request(app).get('/api/reviews/bananas/comments')
        .expect(400)
        .then(({body: {msg}}) => {
            expect(msg).toBe('invalid data type')
        })
    });

    test('200: responds with empty array if passed review_id corresponds to a review with no comments', () => {
        return request(app).get('/api/reviews/4/comments')
        .expect(200)
        .then(({body : {comments}}) => {
            expect(comments).toEqual([]);
        })
    });
});

describe('POST /api/reviews/:review_id/comments', () => {
    test('201: responds with new comment object', () => {
        return request(app).post('/api/reviews/4/comments')
        .send({username: 'mallionaire', body: 'never heard of it before'})
        .expect(201)
        .then(({body : {comment}}) => {
            expect(comment).toMatchObject({
                comment_id: expect.any(Number),
                body : 'never heard of it before',
                review_id : 4,
                author : 'mallionaire',
                votes: 0,
                created_at: expect.any(String)
            })
        })
    });
    
    test('400: responds with error message if req body does not contain required keys', () => {
        return request(app).post('/api/reviews/4/comments')
        .send({username: 'mallionaire'})
        .expect(400)
        .then(({body : { msg } }) => {
            expect(msg).toBe('comment must include username and body keys')
        })
    });

    test('404: responds with error message if passed review_id that does not correspond to a review', () => {
        return request(app).post('/api/reviews/60/comments')
        .send({username: 'mallionaire', body: 'never heard of it before'})
        .expect(404)
        .then(({body: {msg}}) => {
            expect(msg).toBe('no review found for id: 60')
        });
    });

    test('400: responds with error message if passed review_id is wrong data type', () => {
        return request(app).post('/api/reviews/bananas/comments')
        .send({username: 'mallionaire', body: 'never heard of it before'})
        .expect(400)
        .then(({body: {msg}}) => {
            expect(msg).toBe('invalid data type')
        });
    });

    test('404: responds with err msg if user not in the database tries to post', () => {
        return request(app).post('/api/reviews/4/comments')
        .send({username: 'definitelyNotAHacker', body: 'DROP DATABASE IF EXISTS be-nc-games;???'})
        .expect(404)
        .then(({body : {msg}}) => {
            expect(msg).toBe('username is not recognised')
        })
    });
});

describe('DELETE /api/comments/:comment_id', () => {
    test('204: responds with no content ', () => {
        return request(app).delete('/api/comments/2')
        .expect(204);
    });

    test('404: comment not found', () => {
        return request(app).delete('/api/comments/872')
        .expect(404)
        .then(({ body : { msg }}) => {
            expect(msg).toBe('no comment found for id: 872')
        })
    });

    test('400: comment_id is not a number', () => {
        return request(app).delete('/api/comments/bananas')
        .expect(400)
        .then(({body : { msg }}) => {
            expect(msg).toBe('invalid data type')
        })
    });
});

describe('GET /api/users', () => {
    test('200: responds with array of user objects', () => {
        return request(app).get('/api/users')
        .expect(200)
        .then(({body: {users}}) => {
            expect(users).toHaveLength(4);
            for (let user of users) {
                expect(user).toMatchObject({
                    username: expect.any(String),
                    name: expect.any(String),
                    avatar_url:expect.stringContaining('https://')
                })
            }
        })
    });
});