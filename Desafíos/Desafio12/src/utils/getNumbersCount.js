import { generateRandomNumbers } from "./generateRandNumbers.js";

function countNumbers(numbers) {
    const uniques = new Set(numbers);
    const data = {};
    uniques.forEach((number) => {
        const count = numbers.filter((item) => item === number).length;
        data[number] = count;
    });
    return data;
}

process.on("message", ({ cant }) => {
    console.log('Hilo iniciado: ' + process.pid);
    const randomNumbers = generateRandomNumbers(cant);
    const counter = countNumbers(randomNumbers);
    process.send(counter);
});