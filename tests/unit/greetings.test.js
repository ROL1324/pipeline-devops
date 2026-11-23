'use strict';

const { GREETINGS, greeting, greet } = require('../../src/greetings');

describe('greeting()', () => {
  test.each([
    ['es', 'Hola'],
    ['en', 'Hello'],
    ['fr', 'Bonjour'],
    ['EN', 'Hello'],
  ])('devuelve el saludo correcto para "%s"', (lang, expected) => {
    expect(greeting(lang)).toBe(expected);
  });

  test('usa español por defecto', () => {
    expect(greeting()).toBe('Hola');
  });

  test('lanza RangeError con un idioma no soportado', () => {
    expect(() => greeting('de')).toThrow(RangeError);
  });

  test('expone los idiomas disponibles', () => {
    expect(Object.keys(GREETINGS)).toEqual(['es', 'en', 'fr']);
  });
});

describe('greet()', () => {
  test('saluda a una persona', () => {
    expect(greet('Ana')).toBe('Hola, Ana!');
  });

  test('usa "mundo" por defecto', () => {
    expect(greet()).toBe('Hola, mundo!');
  });

  test('recorta los espacios sobrantes', () => {
    expect(greet('  Ana  ')).toBe('Hola, Ana!');
  });

  test('acepta nombres con acentos, apóstrofos y guiones', () => {
    expect(greet("María-José O'Neil")).toBe("Hola, María-José O'Neil!");
  });

  test.each(['', '   ', 'Ana123', '<script>', 'A'.repeat(51)])(
    'rechaza el nombre inválido %p',
    (name) => {
      expect(() => greet(name)).toThrow(TypeError);
    },
  );

  test('propaga el error de idioma no soportado', () => {
    expect(() => greet('Ana', 'de')).toThrow(RangeError);
  });
});
