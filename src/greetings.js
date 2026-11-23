'use strict';

const GREETINGS = Object.freeze({
  es: 'Hola',
  en: 'Hello',
  fr: 'Bonjour',
});

// Letras Unicode (incluye acentos y ñ), espacios, apóstrofos y guiones.
const NAME_PATTERN = /^[\p{L}][\p{L} '-]{0,49}$/u;

/**
 * Devuelve el saludo base del idioma indicado.
 * @param {string} lang Código de idioma (es, en, fr).
 * @returns {string} Saludo base.
 * @throws {RangeError} Si el idioma no está soportado.
 */
function greeting(lang = 'es') {
  const key = String(lang).toLowerCase();
  if (!Object.prototype.hasOwnProperty.call(GREETINGS, key)) {
    throw new RangeError(`Idioma no soportado: ${lang}`);
  }
  return GREETINGS[key];
}

/**
 * Construye un saludo personalizado.
 * @param {string} name Nombre de la persona.
 * @param {string} lang Código de idioma.
 * @returns {string} Saludo completo.
 * @throws {TypeError} Si el nombre no es válido.
 * @throws {RangeError} Si el idioma no está soportado.
 */
function greet(name = 'mundo', lang = 'es') {
  const cleanName = String(name).trim();
  if (!NAME_PATTERN.test(cleanName)) {
    throw new TypeError('Nombre no válido');
  }
  return `${greeting(lang)}, ${cleanName}!`;
}

module.exports = { GREETINGS, greeting, greet };
