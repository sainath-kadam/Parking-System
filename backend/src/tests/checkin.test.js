import request from 'supertest';
import app from '../src/app.js';
import mongoose from 'mongoose';

let token;

beforeAll(async () => {
  const res = await request(app)
    .post('/api/auth/login')
    .send({ password: 'admin123' });
  token = res.body.token;
});

afterAll(async () => {
  await mongoose.connection.close();
});

test('Vehicle check-in success', async () => {
  const res = await request(app)
    .post('/api/parking/check-in')
    .set('Authorization', `Bearer ${token}`)
    .send({
      vehicleNumber: 'TN09AB1234',
      vehicleType: 'CAR',
      ratePerHour: 50,
      owner: { name: 'Suman', mobile: '9999999999' },
      driver: { name: 'Ramesh', mobile: '8888888888' }
    });

  expect(res.statusCode).toBe(201);
  expect(res.body.status).toBe('IN');
});