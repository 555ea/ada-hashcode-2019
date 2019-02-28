const {readInputFile, writeOutputFile} = require('./input-output');
const { intersection, last } = require('lodash');

// const files = ['a_example.txt', 'b_lovely_landscapes.txt', 'c_memorable_moments.txt', 'd_pet_pictures.txt', 'e_shiny_selfies.txt'];
const fileName = 'a_example.txt';

readInputFile(fileName, (response) => {
    let {photos, photosCount} = response;
    console.log(photos);
    const verticalPhotos = photos.filter((photo) => photo.isVertical);
    const horizontalPhotos = photos.filter((photo) => photo.isHorizontal);
    const mapped = [verticalPhotos, horizontalPhotos].map((array) =>
        array.map((photo) => {
            let matchingTagCount = 0;
            const tagsByIndex = {};
            array.forEach((otherPhoto) => {
                if(otherPhoto.photoIndex !== photo.photoIndex){
                    const inter = intersection(photo.tags, otherPhoto.tags);
                    tagsByIndex[otherPhoto.photoIndex] = inter;
                    matchingTagCount += inter.length;
                }
            });
            return {...photo, matchingTagCount, tagsByIndex };
        })
    );
    const sorted = mapped.map((array, index) =>
        (index === 0) ?
            array.sort((photoA, photoB) => photoA.matchingTagCount - photoB.matchingTagCount )
            : array.sort((photoA, photoB) => photoB.matchingTagCount - photoA.matchingTagCount )
    );
    const [verticalSorted, horizontalSorted] = sorted;
    const verticalSlides = [];
    verticalSorted.forEach((photo) => {
        const lastSlide = last(verticalSlides);
        if (!lastSlide || lastSlide.length === 2){
            verticalSlides.push([photo])
        } else {
            lastSlide.push(photo);
        }
    });
    const slides = [
        ...verticalSlides,
        ...horizontalSorted.map((photo) => [photo]),
    ];
    console.log(slides);
});