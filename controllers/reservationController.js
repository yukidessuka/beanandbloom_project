const Reservation = require('../models/reservation');

const createReservation = async (req, res) => {
    const { userId, date, time, numberOfPeople } = req.body;
    try {
        const reservation = new Reservation({ userId, date, time, numberOfPeople });
        await reservation.save();
        res.status(201).json({ message: 'Reservation created successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getReservations = async (req, res) => {
    try {
        const reservations = await Reservation.find().populate('userId');
        res.json(reservations);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = { createReservation, getReservations };
