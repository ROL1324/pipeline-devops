'use strict';

const express = require('express');
const { GREETINGS, greet } = require('./greetings');

/**
 * Crea la aplicación Express. Se exporta como factoría para que los tests
 * de integración puedan montarla sin abrir un puerto real.
 * @returns {import('express').Express}
 */
function createApp() {
  const app = express();

  app.disable('x-powered-by');
  app.use(express.json());

  app.get('/health', (req, res) => {
    res.json({ status: 'ok', uptime: process.uptime() });
  });

  app.get('/', (req, res) => {
    res.json({ message: greet() });
  });

  app.get('/languages', (req, res) => {
    res.json({ languages: Object.keys(GREETINGS) });
  });

  app.get('/greet/:name', (req, res) => {
    const lang = typeof req.query.lang === 'string' ? req.query.lang : 'es';
    try {
      res.json({ message: greet(req.params.name, lang) });
    } catch (error) {
      if (error instanceof RangeError || error instanceof TypeError) {
        res.status(400).json({ error: error.message });
        return;
      }
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  });

  app.use((req, res) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
  });

  return app;
}

module.exports = { createApp };
