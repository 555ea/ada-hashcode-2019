const {readInputFile, writeOutputFile} = require('./input-output');
const { intersection, first, last, flatten, orderBy } = require('lodash');

// const files = ['a_example.txt', 'b_lovely_landscapes.txt', 'c_memorable_moments.txt', 'd_pet_pictures.txt', 'e_shiny_selfies.txt'];
const fileName = 'c_memorable_moments.txt';

readInputFile(fileName, (response) => {
    let {photos, photosCount} = response;
    console.log(photosCount, ' photos read');
    const verticalPhotos = photos.filter((photo) => photo.isVertical);
    const horizontalPhotos = photos.filter((photo) => photo.isHorizontal);
    let slides = [];
    const slidedPhotosObject = {};
    let processedVerticalSlides;
    const mapped = [verticalPhotos, horizontalPhotos].map((array, index) =>
        {
            const photo = first(array);
            if(photo){
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
                if(index === 0){
                    // vertical
                    const sorted = orderBy(tagsByIndexArray, ['tagsIntersectionCount'], ['asc']);
                    const firstVertical = sorted.shift();
                    let verticalSlides = [[photo, firstVertical]];
                    sorted.forEach((photo) => {
                        const lastSlide = last(verticalSlides);
                        if (!lastSlide || lastSlide.length === 2){
                            verticalSlides.push([photo])
                        } else {
                            lastSlide.push(photo);
                        }
                    });
                    processedVerticalSlides = verticalSlides.map((array) => {
                        const firstPhoto = photos[first(array).photoIndex];
                        const lastPhoto = photos[last(array).photoIndex];
                        return {
                            slide: array,
                            tagsIntersectionCount: intersection(firstPhoto.tags, lastPhoto.tags).length
                        };
                    });
                } else {
                    // horizontal
                    const sorted = orderBy(flatten([processedVerticalSlides, tagsByIndexArray]), ['tagsIntersectionCount'], ['desc']);
                    slides = sorted.map((item) => {
                        if(item.slide){
                            return item.slide;
                        }
                        return [item];
                    })
                }
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