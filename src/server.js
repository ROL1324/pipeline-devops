'use strict';

const { createApp } = require('./app');

const port = Number(process.env.PORT) || 3000;
const app = createApp();

const server = app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});

function shutdown(signal) {
  console.log(`Señal ${signal} recibida: cerrando servidor...`);
  server.close(() => process.exit(0));
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
