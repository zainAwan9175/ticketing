import request from 'supertest';
import { app } from '../../app.js';

it('returns a 200 on successful signout', async () => {
  const signupResponse = await request(app)
    .post('/api/users/signup')
    .send({
      email: 'signout@test.com',
      password: 'password',
    })
    .expect(201);

  await request(app)
    .post('/api/users/signout')
    .set('Cookie', signupResponse.get('Set-Cookie')!)
    .send({})
    .expect(200);
});

it('clears the cookie after signout', async () => {
  const signupResponse = await request(app)
    .post('/api/users/signup')
    .send({
      email: 'clear@test.com',
      password: 'password',
    })
    .expect(201);

  const response = await request(app)
    .post('/api/users/signout')
    .set('Cookie', signupResponse.get('Set-Cookie')!)
    .send({})
    .expect(200);

  expect(response.get('Set-Cookie')).toBeDefined();
});