const fs = require('fs'),
    path = require('path');

function readInputFile(name, callback) {
    fs.readFile(`./files/${name}`, 'utf8', function (err, data) {
        const fileRows = data.toString().split('\n');
        const file = {
            photosCount: 0,
            photos: []
        };
        fileRows.forEach((row, index) => {
            if(row.length > 0) {
                const cells = row.split(' ').map((cell) => cell);
                if (index === 0) {
                    const [photosCount] = cells;
                    Object.assign(file, {photosCount: parseInt(photosCount)});
                } else {
                    const [orientation, tagsCount, ...tags] = cells;
                    file.photos.push({orientation, tagsCount: parseInt(tagsCount), tags, isHorizontal: orientation === 'H', isVertical: orientation === 'V', photoIndex: index - 1});
                }
            }
        });
        callback(file);
    });
}

function writeOutputFile(name, slides, callback) {
    let resultString = `${slides.length}\n`;
    slides.map((slide, index) => {
        resultString += `${slide.map((slide) => {
            if(!slide){
                console.log(slides, index);
            }
            return slide.photoIndex;
        }).join(' ')}\n`
    })
    fs.writeFile(`./output/${name}`, resultString, function (err, data) {
        callback('success!');
    });
}


module.exports = {readInputFile, writeOutputFile};



