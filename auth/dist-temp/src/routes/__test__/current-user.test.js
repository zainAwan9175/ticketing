import request from 'supertest';
import { app } from '../../app.js';
it('responds with details about the current user', async () => {
    const signupResponse = await request(app)
        .post('/api/users/signup')
        .send({
        email: 'zain@gmail.com',
        password: 'password',
    })
        .expect(201);
    const response = await request(app)
        .get('/api/users/currentuser')
        .set('Cookie', signupResponse.get('Set-Cookie'))
        .send()
        .expect(200);
    expect(response.body.currentUser.email).toEqual('zain@gmail.com');
});
it('responds with null if not authenticated', async () => {
    const response = await request(app)
        .get('/api/users/currentuser')
        .send()
        .expect(200);
    expect(response.body.currentUser).toEqual(null);
});
