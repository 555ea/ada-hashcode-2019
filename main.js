const {readInputFile, writeOutputFile} = require('./input-output');
const { intersection, first, last, orderBy } = require('lodash');

// const files = ['a_example.txt', 'b_lovely_landscapes.txt', 'c_memorable_moments.txt', 'd_pet_pictures.txt', 'e_shiny_selfies.txt'];
const fileName = 'e_shiny_selfies.txt';

readInputFile(fileName, (response) => {
    let {photos, photosCount} = response;
    console.log(photosCount, ' photos read');
    const verticalPhotos = photos.filter((photo) => photo.isVertical);
    const horizontalPhotos = photos.filter((photo) => photo.isHorizontal);
    let slides = [];
    const slidedPhotosObject = {};
    const mapped = [verticalPhotos, horizontalPhotos].map((array, index) =>
        {
            const photo = first(array);
            let matchingTagCount = 0;
            const tagsByIndex = {};
            array.forEach((otherPhoto) => {
                if(otherPhoto.photoIndex !== photo.photoIndex){
                    const inter = intersection(photo.tags, otherPhoto.tags);
                    tagsByIndex[otherPhoto.photoIndex] = inter.length;
                    matchingTagCount += inter.length;
                }
            });
            const tagsByIndexArray = Object.keys(tagsByIndex).map((photoIndex)=>({photoIndex, tagsIntersectionCount: tagsByIndex[photoIndex]}));
            const sorted = orderBy(tagsByIndexArray, ['tagsIntersectionCount'], [(index === 0) ? 'asc' : 'desc']);
            if(index === 0){
                // vertical
                const first = sorted.shift();
                slides = [[photo, first]];
                const verticalSlides = [];
                sorted.forEach((photo) => {
                    const lastSlide = last(verticalSlides);
                    if (!lastSlide || lastSlide.length === 2){
                        verticalSlides.push([photo])
                    } else {
                        lastSlide.push(photo);
                    }
                });
                slides = [...slides, ...verticalSlides];
            } else {
                // horizontal
                slides = [...slides, [photo], ...sorted.map((photo) => [photo])]
            }
        }
    );
    // const sorted = mapped.map((array, index) =>
    //     (index === 0) ?
    //         array.sort((photoA, photoB) => photoA.matchingTagCount - photoB.matchingTagCount )
    //         : array.sort((photoA, photoB) => photoB.matchingTagCount - photoA.matchingTagCount )
    // );
    // const [verticalSorted, horizontalSorted] = sorted;
    // const verticalSlides = [];
    // verticalSorted.forEach((photo) => {
    //     const lastSlide = last(verticalSlides);
    //     if (!lastSlide || lastSlide.length === 2){
    //         verticalSlides.push([photo])
    //     } else {
    //         lastSlide.push(photo);
    //     }
    // });
    // const slides = [
    //     ...verticalSlides,
    //     ...horizontalSorted.map((photo) => [photo]),
    // ];
    console.log(slides.length, 'slides to be written');
    writeOutputFile(fileName, slides, (result) => {
        console.log(result);
    })
});