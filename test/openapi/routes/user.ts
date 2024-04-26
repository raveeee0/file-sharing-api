import fetch from 'node-fetch';
import jestOpenAPI from 'jest-openapi';
import axios from 'axios';

import connectTestDB from '../../config/database';

jestOpenAPI(__dirname + '/../../../openapi/openapi.yaml');

beforeAll(() => {
    return connectTestDB();
});

describe('GET /user', () => {
    it('should return users', async () => {
        const response = await axios.get('http://localhost:3000/user');
        expect(response).toSatisfyApiSpec();
    });
});
