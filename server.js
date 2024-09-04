const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const TOTAL_STUDENTS = 20000;
const TIMER_DURATION = 48 * 60 * 60 * 1000; // 5 minutes in milliseconds

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from the 'public' directory

let count = 0;
let startTime = Date.now();
let isPaused = false;

// Load count and pause state from a file if it exists
if (fs.existsSync('count.json')) {
    const data = fs.readFileSync('count.json', 'utf-8');
    const parsedData = JSON.parse(data);
    count = parsedData.count;
    startTime = parsedData.startTime || startTime;
    isPaused = parsedData.isPaused || false;
} else {
    fs.writeFileSync('count.json', JSON.stringify({ count, startTime, isPaused }));
}

// Endpoint to get the current count and timer status
app.get('/count', (req, res) => {
    if (isPaused) {
        return res.json({ message: 'Server is paused', count, percentage: (count / TOTAL_STUDENTS) * 100, timeLeft: TIMER_DURATION });
    }

    const elapsedTime = Date.now() - startTime;
    const percentage = (count / TOTAL_STUDENTS) * 100;
    const timeLeft = Math.max(TIMER_DURATION - elapsedTime, 0);
    const revealLogo = percentage >= 100 || timeLeft === 0;

    res.json({ count, percentage, timeLeft, revealLogo });
});

// Endpoint to increment the count
app.post('/increment', (req, res) => {
    if (isPaused) {
        return res.json({ message: 'Server is paused', count, percentage: (count / TOTAL_STUDENTS) * 100 });
    }
    
    count++;
    fs.writeFileSync('count.json', JSON.stringify({ count, startTime, isPaused }));
    res.json({ count, percentage: (count / TOTAL_STUDENTS) * 100 });
});

// Endpoint to reset the count and timer
app.post('/reset', (req, res) => {
    count = 0;
    startTime = Date.now();
    fs.writeFileSync('count.json', JSON.stringify({ count, startTime, isPaused }));
    res.json({ message: 'Reset successful' });
});

// Endpoint to pause the server
app.post('/pause', (req, res) => {
    isPaused = true;
    fs.writeFileSync('count.json', JSON.stringify({ count, startTime, isPaused }));
    res.json({ message: 'Server is paused' });
});

// Endpoint to resume the server
app.post('/resume', (req, res) => {
    isPaused = false;
    startTime = Date.now(); // Adjust start time to continue the timer
    fs.writeFileSync('count.json', JSON.stringify({ count, startTime, isPaused }));
    res.json({ message: 'Server is resumed' });
});

// Endpoint to force complete the progress bar
app.post('/force-complete', (req, res) => {
    count = TOTAL_STUDENTS; // Set count to the total number of students to force 100% progress
    fs.writeFileSync('count.json', JSON.stringify({ count, startTime, isPaused }));
    res.json({ message: 'Progress has been forced to 100%' });

    // Optionally, trigger additional actions, such as revealing the logo
    console.log('Progress has been forced to 100%.');
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
