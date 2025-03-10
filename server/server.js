const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Store latest location
let currentLocation = {
    lat: 12.819194,
    lng: 74.841361
};

// Endpoint for driver to update location
app.post('/update-location', (req, res) => {
    const { lat, lng, driverId } = req.body;
    
    // Add validation here
    currentLocation = { lat, lng };
    res.status(200).json({ message: 'Location updated' });
});

// Endpoint for website to get location
app.get('/get-location', (req, res) => {
    res.status(200).json(currentLocation);
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
// Add rate limiting (install express-rate-limit)
const rateLimit = require('express-rate-limit');
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/update-location', apiLimiter);

// Add simple authentication middleware
const authenticateDriver = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader === 'Bearer YOUR_DRIVER_TOKEN') {
        next();
    } else {
        res.status(401).json({ error: 'Unauthorized' });
    }
};

app.post('/update-location', authenticateDriver, (req, res) => {
    // Existing code...
});