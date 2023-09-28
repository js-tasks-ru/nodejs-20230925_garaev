function sum(a, b) {
  if (typeof a !== 'number' || typeof b !== 'number') {
    throw new TypeError('Должна быть сумма чисел');
  }
  return a + b;
}

module.exports = sum;
