import request from 'supertest';
import server from '../../../src/server';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userModel from '../../../src/models/user';
import NoUserFoundException from '../../../src/exceptions/NoUserFoundException';
import User from '../../../src/types/userInterface';


import bcrypt from 'bcrypt';

import connectTestDB from '../../config/database';

dotenv.config();

beforeAll(async () => {
    if (mongoose.connection.readyState === 0)
        await connectTestDB();
});

afterAll(async () => {
    server.close();
    await mongoose.connection.close();
});


describe('GET /users', () => {

    beforeEach(async () => {
        const password = await bcrypt.hash('123456', 10);
        await userModel.create({
            name: 'John Doe',
            email: 'prova@mail.com',
            password,
            username: 'john_doe',
            role: 'admin',
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

        
        // for (const prop in User) {
        //     expect(response.body[0]).toHaveProperty(prop);
        // }

        expect(response.body[0].files).toBeInstanceOf(Array);
        expect(response.body[0].friends).toBeInstanceOf(Array);

        expect(response.body[0].name).toBe('John Doe');
        expect(response.body[0].email).toBe('prova@mail.com');

        const passwordMatches = await bcrypt.compare('123456', response.body[0].password);
        expect(passwordMatches).toBe(true);
        expect(response.body[0].username).toBe('john_doe');
        expect(response.body[0].role).toBe('admin');
    });

    it('should return 200 with empty array if no users are found', async () => {
        await userModel.deleteMany({});
        const response = await request(server).get('/users');

        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
        expect(response.body).toBeInstanceOf(Array);
        expect(response.body.length).toBe(0);
    });

    it('should return 500 if an error occurs', async () => {
        jest.spyOn(userModel, 'find').mockRejectedValue(new Error('Unexpected Error'));
        const response = await request(server).get('/users');

        expect(response.status).toBe(500);
        expect(response.body).toBeInstanceOf(Object);
        expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
        expect(response.body).toHaveProperty('message');
    });
});

describe('GET /users/:id', () => {

    beforeEach(async () => {
        const password = await bcrypt.hash('333333', 10);
        await userModel.create({
            name: 'John Doe',
            email: 'prova@mail.com',
            password,
            username: 'john_doee',
            role: 'admin',
        });
    });

    afterEach(async () => {
        await userModel.deleteMany({});
    });

    it('should return user correctly', async () => {
        const user = await userModel.findOne({ email: 'prova@mail.com' });

        if (user) {
            const response = await request(server).get(`/users/${user._id}`);

            expect(response.status).toBe(200);
            console.log(response.body);
            expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
            expect(response.body).toBeInstanceOf(Object);
            
            for (const prop in response.body[0]) {
                expect(response.body[0]).toHaveProperty(prop);
            }
    
            expect(response.body.files).toBeInstanceOf(Array);
            expect(response.body.friends).toBeInstanceOf(Array);
            expect(response.body.name).toBe(user.name);
            expect(response.body.email).toBe(user.email);

            const passwordMatches = response.body.password == user.password;
            expect(passwordMatches).toBe(true);
            expect(response.body.username).toBe(user.username);
            expect(response.body.role).toBe(user.role);

        }
    });

    it('should return 404 if user is not found', async () => {
        const response = await request(server).get('/users/5f7b4b2b0f7d6d001f9e6f1b');

        expect(response.status).toBe(404);
        expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
        expect(response.body).toBeInstanceOf(Object);


    });

});
