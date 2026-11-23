'use strict';

const fc = require('fast-check');
const { greet } = require('../../src/greetings');

const LETTERS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZáéíóúüñÁÉÍÓÚÜÑ';
const validName = fc
  .array(fc.constantFrom(...LETTERS.split('')), { minLength: 1, maxLength: 20 })
  .map((chars) => chars.join(''));

describe('propiedades de greet()', () => {
  test('con nombres válidos siempre devuelve "Hola, <nombre>!"', () => {
    fc.assert(
      fc.property(validName, (name) => {
        const message = greet(name);
        return (
          message.startsWith('Hola, ') &&
          message.endsWith('!') &&
          message.includes(name)
        );
      }),
    );
  });

  test('solo acepta los idiomas del catálogo', () => {
    fc.assert(
      fc.property(
        fc.string().filter((lang) => !['es', 'en', 'fr'].includes(lang.toLowerCase())),
        (lang) => {
          try {
            greet('Ana', lang);
            return false;
          } catch (error) {
            return error instanceof RangeError;
          }
        },
      ),
    );
  });
});
