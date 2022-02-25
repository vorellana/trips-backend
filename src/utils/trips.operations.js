const exp = {};
const NodeGeocoder = require('node-geocoder');
const config = require('../config');
const optionsNg = {
    provider: 'google',  
    // fetch: customFetchImplementation,
    apiKey: config.apiKey,
    formatter: null
};

const geocoder = NodeGeocoder(optionsNg);

const getStartEnd = async (readings) => {
    readings.sort((a,b) => (a.time > b.time) ? 1 : ((b.time > a.time) ? -1 : 0))
    const startLocation = await geocoder.reverse({ 
        lat: readings[0].location.lat, 
        lon: readings[0].location.lon 
    });
    const endLocation = await geocoder.reverse({ 
        lat: readings[readings.length - 1].location.lat, 
        lon: readings[readings.length - 1].location.lon 
    });
    const start = {
        time: readings[0].time,
        lat: readings[0].location.lat,
        lon: readings[0].location.lon,
        address: startLocation[0].formattedAddress
    }
    const end = {
        time: readings[readings.length - 1].time,
        lat: readings[readings.length - 1].location.lat,
        lon: readings[readings.length - 1].location.lon,
        address: endLocation[0].formattedAddress
    }
    return { start, end };
}

exp.generateTrip = async (body) => {
    const readings = body.readings
    const { start, end } = await getStartEnd(readings);
    const distance = Math.sqrt(Math.pow((end.lat - start.lat), 2) + Math.pow((end.lon - start.lon), 2));
    const duration = end.time - start.time;
    const boundingBox = [];
    let overspeedsCount = 0;

    readings.forEach(item => {
        if (item.speed > item.speedLimit)
            overspeedsCount ++;
        boundingBox.push(item.location);
    });

    const trip = {
        start: start,
        end: end,
        distance: distance,
        duration: duration,
        overspeedsCount: overspeedsCount,
        boundingBox:boundingBox
    }
    return trip;
}

exp.validateTrip = async (body) => {
    const readings = body.readings
    let success = false;
    let message = '';
    let withoutTime = false;
    readings.forEach(item => {
        if (item.time === undefined){
            withoutTime = true;
            return;
        }            
    });
    if ( withoutTime ) {
        message = 'Todos los readings deben tener la propiedad time';
    } else if (readings.length < 5 ){
        message = 'Para construir el viaje deben haber por lo menos 5 readings';
    } else {
        success = true
    }
    return { success, message };
}

module.exports = exp;