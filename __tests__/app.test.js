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

    test('405: responds with msg and allowed methods if incorrect method used', () => {
        return request(app).post('/api/categories')
        .expect(405)
        .then(({body}) => {
            expect(body).toEqual({
                msg : 'POST method not supported for this route',
                Allow: ['GET']
            });
        })
    });
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
});