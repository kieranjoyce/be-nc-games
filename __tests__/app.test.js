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

describe('GET /api/reviews/:review_id', () => {
    test('200: responds with specified review', () => {
        return request(app).get('/api/reviews/2')
        .expect(200)
        .then(({body: {review}}) => {
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
                votes: 5
            })
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