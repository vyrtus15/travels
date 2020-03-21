import random = require('randomstring');

export function randomTravel() {
  return {
    destination: random.generate(10),
    comment: random.generate(10),
  };
}
