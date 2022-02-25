const { Router } = require('express');
const router = Router();
const { getTrips, createTrip } = require('../controllers/trips.controller')
const morgan = require('morgan')
const { verifyToken } = require('../utils/security/authentication');

const baseV1 = '/api/trips/v1';
const baseV2 = '/api/trips/v2';

// API v1
router.get(baseV1, morgan('combined'), getTrips);
router.post(baseV1, morgan('combined'), createTrip);

// API v2
router.get(baseV2, [morgan('combined'), verifyToken],  getTrips);
router.post(baseV2, [morgan('combined'), verifyToken], createTrip);

router.get('/info', (req, res) => {
    res.status(200).json({message: "hola"})
} );

module.exports = router;