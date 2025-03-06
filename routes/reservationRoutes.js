const express = require('express');
const { createReservation, getReservations } = require('../controllers/reservationController');
const router = express.Router();

router.post('/reserve', createReservation);
router.get('/reservations', getReservations);

module.exports = router;
