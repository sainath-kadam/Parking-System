test('Vehicle check-out success', async () => {
  const res = await request(app)
    .post('/api/parking/check-out')
    .set('Authorization', `Bearer ${token}`)
    .send({
      vehicleNumber: 'TN09AB1234',
      driver: { name: 'Ramesh', mobile: '8888888888' }
    });

  expect(res.statusCode).toBe(200);
  expect(res.body.status).toBe('OUT');
});