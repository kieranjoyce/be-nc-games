process.env.NODE_ENV = 'test';

const request = require('supertest');
const app = require('../app');
const db = require('../db/connection');
const testData = require('../db/data/test-data');
const seed = require('../db/seeds/seed');

beforeEach(() => seed(testData))

afterAll(() => db.end());

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
});