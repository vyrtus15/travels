import random = require('randomstring');

export function randomUser() {
  return {
    userName: `${random.generate(8)}@${random.generate(8)}.com`.toLowerCase(),
    firstName: random.generate(10),
    lastName: random.generate(10),
    password: random.generate(10),
  };
}
