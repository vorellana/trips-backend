const request = require('supertest')
const mongoose = require('mongoose');
const app = require('../src/app')
const { testReadings1 } = require('./testData')
const baseV1 = '/api/trips/v1';
const baseV2 = '/api/trips/v2';

describe('GET ' + baseV1, () => {
    test('should respond with a 200 status code', async () => {
        const response = await request(app).get(baseV1).send();
        expect(response.statusCode).toBe(200);
    })
    test('should respond with a json', async () => {
        const response = await request(app).get(baseV1).send();
        expect(response.body).toBeInstanceOf(Object);
    })
    test('should respond with a Content-type: application/json header', async () => {
        const response = await request(app).get(baseV1).send();
        expect(response.headers["content-type"]).toEqual(
            expect.stringContaining("json")
        );
    })
})

describe('POST ' + baseV1, () => {
    
    test('should respond with a 200 status code', async () => {
        const response = await request(app).post(baseV1).send(testReadings1);
        expect(response.statusCode).toBe(200);
    })
    test('should respond with a json', async () => {
        const response = await request(app).post(baseV1).send(testReadings1);
        expect(response.body).toBeInstanceOf(Object);
    })    
    test('should respond with a Content-type: application/json header', async () => {
        const response = await request(app).post(baseV1).send(testReadings1);
        expect(response.headers["content-type"]).toEqual(
            expect.stringContaining("json")
        );
    })
    test('should respond with id, distance, duration in the body', async () => {
        const response = await request(app).post(baseV1).send(testReadings1);
        expect(response.body.id).toBeDefined();
        expect(response.body.distance).toBeDefined();
        expect(response.body.duration).toBeDefined();
    })    
})

afterAll( async () => {
    await mongoose.connection.close();
})