const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const userRoutes = require('./routes/userRoutes');
const Reservation = require('./models/reservation');
const app = express();
const PORT = process.env.PORT || 3000;

// Use Express to serve static files from the "public" directory
app.use(express.static('public'));

// Set EJS as the template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Use body-parser middleware for handling form submissions
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Set up API routes for user
app.use('/api/users', userRoutes);

// Route for login page
app.get('/login', (req, res) => {
    res.render('login');
});

// Route for signup page
app.get('/signup', (req, res) => {
    res.render('signup');
});

// Route for the dashboard page
app.get('/', (req, res) => {
    res.render('dashboard');
});

// Route for logout
app.get('/logout', (req, res) => {
    res.redirect('/login');    // Redirect to login
});

// Route for the Make Reservation page
app.get('/make-reservation', (req, res) => {
    res.render('reservation');  // Render reservation form
});

// Route for handling form submission (Create Reservation)
app.post('/api/reservations', async (req, res) => {
    const { name, email, date, time, people, tableType } = req.body;

    // Validate form data
    if (!name || !email || !date || !time || !people || !tableType) {
        return res.status(400).send('Please fill in all fields');
    }

    // Create a new reservation
    const newReservation = new Reservation({
        name,
        email,
        date,
        time,
        people,
        tableType
    });

    try {
        // Save reservation to MongoDB
        const savedReservation = await newReservation.save();

        // Render the confirmation page with reservation details, including _id
        res.render('confirm', {
            name,
            email,
            date,
            time,
            people,
            tableType,
            _id: savedReservation._id  // Pass _id to the confirm.ejs view
        });
    } catch (err) {
        console.error("Error saving reservation:", err);
        res.status(500).send('Server Error');
    }
});

// Route for the Home page
app.get('/home', (req, res) => {
    res.render('home'); // Render the home page
});

// Route for viewing all reservations
app.get('/view-reservation', async (req, res) => {
    try {
        const reservations = await Reservation.find(); // Get all reservations from the database
        res.render('view-reservation', { reservations }); // Render the view-reservation page
    } catch (err) {
        console.error("Error fetching reservations:", err);
        res.status(500).send('Server Error');
    }
});

// Route แสดงหน้าจอแก้ไขการจอง
app.get('/edit-reservation/:id', async (req, res) => {
    const reservationId = req.params.id;
    try {
        // ค้นหาการจองจาก id
        const reservation = await Reservation.findById(reservationId);

        if (!reservation) {
            return res.status(404).send('Reservation not found');
        }

        // ส่งข้อมูลการจองไปแสดงในฟอร์ม
        res.render('edit-reservation', { reservation });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

app.post('/update-reservation/:id', async (req, res) => {
    const reservationId = req.params.id;
    const { name, email, date, time, people, tableType } = req.body;

    try {
        const updatedReservation = await Reservation.findByIdAndUpdate(
            reservationId,
            {
                name,
                email,
                date,
                time,
                people,
                tableType
            },
            { new: true }
        );

        if (!updatedReservation) {
            return res.status(404).send('Reservation not found');
        }

        // หลังจากอัปเดตแล้วให้กลับไปที่หน้า /api/reservations
        res.redirect('/api/reservations');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true })); // ใช้สำหรับรับข้อมูลจากฟอร์ม



// MongoDB connection
mongoose.connect('mongodb+srv://yukieiei:yukilove123@cluster0.vl89a.mongodb.net/restaurant', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    // Start the server only after a successful database connection
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
})
.catch((err) => {
    console.error('MongoDB connection error:', err);
});
