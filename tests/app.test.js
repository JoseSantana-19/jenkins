const request = require('supertest');
const fs = require('fs');
const path = require('path');
const app = require('../index');

const usersFile = path.join(__dirname, '..', 'users.json');
const testUser = { id: 'test123', name: 'Test User', email: 'test@example.com' };
const originalUsersFile = fs.readFileSync(usersFile, 'utf8');

describe('API de usuarios', () => {
  beforeEach(() => {
    fs.writeFileSync(usersFile, originalUsersFile, 'utf8');
  });

  afterAll(() => {
    fs.writeFileSync(usersFile, originalUsersFile, 'utf8');
  });

  it('Debe responder el endpoint raíz', async () => {
    const response = await request(app).get('/');

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toMatch(/Servidor en ejecucion/i);
  });

  it('Debe crear un nuevo usuario', async () => {
    const response = await request(app).post('/users').send(testUser);

    expect(response.statusCode).toBe(201);
    expect(response.body.user).toMatchObject(testUser);
  });

  it('Debe rechazar la creación si faltan campos obligatorios', async () => {
    const response = await request(app).post('/users').send({ id: 'incompleto' });

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toMatch(/required/i);
  });

  it('Debe rechazar un usuario duplicado', async () => {
    await request(app).post('/users').send(testUser);

    const response = await request(app).post('/users').send(testUser);

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toMatch(/same ID/i);
  });

  it('Debe obtener todos los usuarios', async () => {
    await request(app).post('/users').send(testUser);

    const response = await request(app).get('/users');

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body).toEqual(expect.arrayContaining([expect.objectContaining(testUser)]));
  });

  it('Debe obtener un usuario por id', async () => {
    await request(app).post('/users').send(testUser);

    const response = await request(app).get(`/users/${testUser.id}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.user).toMatchObject(testUser);
  });

  it('Debe responder 404 al buscar un usuario inexistente', async () => {
    const response = await request(app).get('/users/no-existe');

    expect(response.statusCode).toBe(404);
    expect(response.body.error).toMatch(/not found/i);
  });

  it('Debe actualizar un usuario existente', async () => {
    await request(app).post('/users').send(testUser);

    const response = await request(app).put(`/users/${testUser.id}`).send({ name: 'Updated User' });

    expect(response.statusCode).toBe(200);
    expect(response.body.user.name).toBe('Updated User');
  });

  it('Debe responder 404 al actualizar un usuario inexistente', async () => {
    const response = await request(app).put('/users/no-existe').send({ name: 'Updated User' });

    expect(response.statusCode).toBe(404);
    expect(response.body.error).toMatch(/not found/i);
  });

  it('Debe eliminar un usuario existente', async () => {
    await request(app).post('/users').send(testUser);

    const response = await request(app).delete(`/users/${testUser.id}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toMatch(/deleted/i);
  });

  it('Debe responder 404 al eliminar un usuario inexistente', async () => {
    const response = await request(app).delete('/users/no-existe');

    expect(response.statusCode).toBe(404);
    expect(response.body.error).toMatch(/not found/i);
  });
});