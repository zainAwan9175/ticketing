import request from 'supertest';
import { app } from '../../app.js';

it('returns a 200 on successful signin', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'signin@test.com',
      password: 'password',
    })
    .expect(201);

  await request(app)
    .post('/api/users/signin')
    .send({
      email: 'signin@test.com',
      password: 'password',
    })
    .expect(200);
});

it('returns a 400 with invalid credentials', async () => {
  await request(app)
    .post('/api/users/signin')
    .send({
      email: 'missing@test.com',
      password: 'password',
    })
    .expect(400);
});

it('sets a cookie after successful signin', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'cookie@test.com',
      password: 'password',
    })
    .expect(201);

  const response = await request(app)
    .post('/api/users/signin')
    .send({
      email: 'cookie@test.com',
      password: 'password',
    })
    .expect(200);

  expect(response.get('Set-Cookie')).toBeDefined();
});