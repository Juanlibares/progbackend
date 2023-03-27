const min = 1;
const max = 1000;

export const generateRandomNumbers = (cant) => {
  const numbers = [];
  for (let i = 0; i < cant; i++) {
    numbers.push(Math.floor((Math.random() * max) + min));
  }
  return numbers;
}
