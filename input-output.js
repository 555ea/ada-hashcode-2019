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

function writeOutputFile(name, vehicleRides, rides, callback) {
    if (!callback) {
        callback = rides;
    }
    const vehicleRideIndexArrays = [];
    vehicleRides.forEach((vehicleRide) => {
        vehicleRideIndexArrays[vehicleRide.vehicle] = vehicleRideIndexArrays[vehicleRide.vehicle] || [];
        vehicleRideIndexArrays[vehicleRide.vehicle].push(vehicleRide.rideIndex);
    });
    let resultString = '';
    vehicleRideIndexArrays.map((vehicleRideIndexArray, vehicleIndex) => {
        resultString += `${vehicleRideIndexArray.length} ${vehicleRideIndexArray.join(' ')}\n`
    })
    fs.writeFile(`./files/output/${name}`, resultString, function (err, data) {
        callback('success!');
    });
}


module.exports = {readInputFile, writeOutputFile};



