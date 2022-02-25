const exp = {};
const { getTrips, createTrip } = require('../services/trips.service')
const { validateTrip } = require('../utils/trips.operations')

exp.getTrips = async (req, res) => {
    const query = require('url').parse(req.url, true).query;
    let response
    try {
        response = await getTrips(query);    
        res.status(200).json(response);
    } catch (error) {
        res.status(404).json({
            error: {
                statusCode: 404,
                errorCode: 0,
                srcMessage: "-",
                translatedMessage: error.message
            }
        });
    }
}

exp.createTrip = async (req, res) => {
    let response;
    try {
        let { success, message } = await validateTrip(req.body)
        if ( success ){
            response = await createTrip(req.body);    
            res.status(200).json(response);
        } else {
            res.status(422).json({
                error: {
                    statusCode: 422,
                    errorCode: 0,
                    srcMessage: "Invalid attribute",
                    translatedMessage: message // "Atributo inválido"
                }
            });
        }        
    } catch (error) {
        res.status(404).json({
            error: {
                statusCode: 404,
                errorCode: 0,
                srcMessage: "-",
                translatedMessage: error.message
            }
        });
    }
}

module.exports = exp;