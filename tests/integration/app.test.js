'use strict';

const request = require('supertest');
const { createApp } = require('../../src/app');

describe('API HTTP', () => {
  const app = createApp();

  test('GET /health devuelve el estado del servicio', async () => {
    const res = await request(app).get('/health').expect(200);
    expect(res.body.status).toBe('ok');
    expect(typeof res.body.uptime).toBe('number');
  });

  test('GET / devuelve un saludo', async () => {
    const res = await request(app).get('/').expect(200);
    expect(res.body.message).toBe('Hola, mundo!');
  });

  test('GET /languages lista los idiomas disponibles', async () => {
    const res = await request(app).get('/languages').expect(200);
    expect(res.body.languages).toEqual(['es', 'en', 'fr']);
  });

  test('GET /greet/Ana saluda en español', async () => {
    const res = await request(app).get('/greet/Ana').expect(200);
    expect(res.body.message).toBe('Hola, Ana!');
  });

  test('GET /greet/Ana?lang=en saluda en inglés', async () => {
    const res = await request(app).get('/greet/Ana?lang=en').expect(200);
    expect(res.body.message).toBe('Hello, Ana!');
  });

  test('devuelve 400 con un nombre inválido', async () => {
    const res = await request(app).get('/greet/Ana123').expect(400);
    expect(res.body.error).toMatch(/Nombre no válido/);
  });

  test('devuelve 400 con un idioma no soportado', async () => {
    const res = await request(app).get('/greet/Ana?lang=de').expect(400);
    expect(res.body.error).toMatch(/Idioma no soportado/);
  });

  test('devuelve 404 en rutas desconocidas', async () => {
    const res = await request(app).get('/no-existe').expect(404);
    expect(res.body.error).toBe('Ruta no encontrada');
  });
});
