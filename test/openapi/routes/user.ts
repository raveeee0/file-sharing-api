import request from 'supertest';
import server from '../../../src/server';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userModel from '../../../src/models/user';

import connectTestDB from '../../config/database';

dotenv.config();

beforeAll(async () => {
    await connectTestDB();
});

afterAll(async () => {
    server.close();
    await mongoose.connection.close();
});


describe('GET /users', () => {

    beforeEach(async () => {
        await userModel.create({
            name: 'John Doe',
            email: 'prova@mail.com',
            password: '123456',
            username: 'john_doe',
            role: 'user',
        });
    });

    afterEach(async () => {
        await userModel.deleteMany({});
    });


    it('should return users correctly', async () => {
        const response = await request(server).get('/users');

        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
        expect(response.body).toBeInstanceOf(Array);
        expect(response.body.length).toBe(1);
        expect(response.body[0]).toHaveProperty('_id');
        expect(response.body[0]).toHaveProperty('username');
        expect(response.body[0]).toHaveProperty('email');
        expect(response.body[0]).toHaveProperty('files');
        expect(response.body[0].files).toBeInstanceOf(Array);
        expect(response.body[0]).toHaveProperty('friends');
        expect(response.body[0].friends).toBeInstanceOf(Array);
        expect(response.body[0]).toHaveProperty('name');
        expect(response.body[0]).toHaveProperty('role');
    });
});