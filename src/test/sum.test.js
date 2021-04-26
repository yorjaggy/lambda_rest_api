const suma = require('../sumController/suma.js');

test('adds 1 + 2 to equal 3', () => {
  expect(suma(1, 2)).toBe(3);
});