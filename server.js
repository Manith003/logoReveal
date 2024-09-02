const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const TOTAL_STUDENTS = 50;
const TIMER_DURATION = 48 * 60 * 60 * 1000; // 48 hours in milliseconds
// const TIMER_DURATION = 5 * 60 * 1000; // 1 minute in milliseconds


app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from the 'public' directory

let count = 0;
let startTime = Date.now();

// Load count from a file if it exists
if (fs.existsSync('count.json')) {
    const data = fs.readFileSync('count.json', 'utf-8');
    const parsedData = JSON.parse(data);
    count = parsedData.count;
    startTime = parsedData.startTime || startTime;
} else {
    fs.writeFileSync('count.json', JSON.stringify({ count, startTime }));
}

// Endpoint to get the current count and timer status
app.get('/count', (req, res) => {
    const elapsedTime = Date.now() - startTime;
    const percentage = (count / TOTAL_STUDENTS) * 100;
    const timeLeft = Math.max(TIMER_DURATION - elapsedTime, 0);
    const revealLogo = percentage >= 100 && timeLeft === 0;


    res.json({ count, percentage, timeLeft, revealLogo });
});

// Endpoint to increment the count
app.post('/increment', (req, res) => {
    count++;
    fs.writeFileSync('count.json', JSON.stringify({ count, startTime }));
    res.json({ count, percentage: (count / TOTAL_STUDENTS) * 100 });
});

// Endpoint to reset the count and timer
app.post('/reset', (req, res) => {
    count = 0;
    startTime = Date.now();
    fs.writeFileSync('count.json', JSON.stringify({ count, startTime }));
    res.json({ message: 'Reset successful' });
});

// Serve index.html and admin.html for their respective routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});