const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

function formatDate(newDate) {
    // Build the desired string manually
    const year = newDate.getFullYear();
    const month = newDate.toLocaleDateString('en-US', { month: 'short' });
    const day = newDate.getDate().toString().padStart(2, '0'); // Ensure two digits with leading zero
    const hours = newDate.getHours().toString().padStart(2, '0');
    const minutes = newDate.getMinutes().toString().padStart(2, '0');
    const seconds = newDate.getSeconds().toString().padStart(2, '0');

    const formattedString = `${month}_${day}_${year}_${hours}:${minutes}:${seconds}`;

    return formattedString;
}

// To parse JSON and URL-encoded payloads
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Log function
function logToFile(endpoint, payload) {
    const file_name = `./output/${endpoint}_${formatDate(new Date(), true)}_list.log`;
    const logEntry = `[${new Date().toISOString()}] ${endpoint}:\n${JSON.stringify(payload, null, 2)}\n\n`;
    fs.writeFileSync(file_name, logEntry);
}

// Universal handler
function handleRequest(req, res, endpointName) {
    const payload = {
        method: req.method,
        headers: req.headers,
        body: req.body,
        query: req.query,
        url: req.originalUrl
    };
    logToFile(endpointName, payload);
    console.log(`received: ${endpointName}`, JSON.stringify(payload));
    res.status(200).send({
        endpoint: endpointName, info: "OK",
        status: 200
    });
}

// Endpoints
app.all('/redirect', (req, res) => handleRequest(req, res, 'redirectUrl'));
app.all('/webhook', (req, res) => handleRequest(req, res, 'webhookUrl'));
app.all('/notification', (req, res) => handleRequest(req, res, 'notificationUrl'));

// Start server
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
