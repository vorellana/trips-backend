const exp = {};
const Trip = require('../models/trips');
const { generateTrip } = require('../utils/trips.operations')

exp.getTrips = async (query) => {
    const limit = parseInt(query.limit);
    const offset = parseInt(query.offset);
    const trips = await Trip.find({}).sort({'id': -1}).skip(offset).limit(limit).select({
        id: 1, start: 1, end: 1, distance: 1 , duration: 1, overspeedsCount: 1, boundingBox: 1, _id: 0
    });
    const totalCount = await Trip.count();
    const totalPages = Math.ceil(totalCount / limit);
    const currentPage = Math.ceil(offset / limit);
    const response = {
        pagination: {
            total: totalCount,
            page: currentPage,
            pages: totalPages
        },
        data: trips,
    }
    return response;
}

exp.createTrip = async (body) => {
    const jsonTrip = await generateTrip(body);
    const newTrip = new Trip(jsonTrip);
    const resSave = await newTrip.save();
    const jsonResponse = Object.assign({id: resSave.id.toString()}, jsonTrip);
    return jsonResponse;
}

module.exports = exp;