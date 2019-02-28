const {readInputFile, writeOutputFile} = require('./input-output');

// const files = ['a_example.txt', 'b_lovely_landscapes.txt', 'c_memorable_moments.txt', 'd_pet_pictures.txt', 'e_shiny_selfies.txt'];
const fileName = 'a_example.txt';

readInputFile(fileName, (response) => {
    let {photos, photosCount} = response;
    console.log(photos);
});