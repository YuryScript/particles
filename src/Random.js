export default class Random {
  /** [a, b) */
  static intBetween(a, b) {
    if (!b) {
      b = a;
      a = 0;
    }
    return Math.floor(Math.random() * (b - a) + a);
  }
  /** [a, b) */
  static floatBetween(a, b) {
    if (!b) {
      b = a;
      a = 0;
    }
    return Math.random() * (b - a) + a;
  }

  static fromArray(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  static indexFromArray(array) {
    return Math.floor(Math.random() * array.length);
  }
}
