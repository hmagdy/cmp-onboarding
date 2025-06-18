const express = require('express');
const fs = require('fs');
const app = express();
const port = 4200;
const whatsappSignupRoutes = require('./meta-integration/routes/whatsapp-signup.routes');
const https = require('https');

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

const options = {
  key: fs.readFileSync('cert/key.pem'),
  cert: fs.readFileSync('cert/cert.pem')
};

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
app.get('/', (req, res) => res.send('Server is running'));
app.get('/test', (req, res) => res.send('Routing works!'));
app.all('/redirect', (req, res) => handleRequest(req, res, 'redirectUrl'));
app.all('/webhook', (req, res) => handleRequest(req, res, 'webhookUrl'));
app.all('/notification', (req, res) => handleRequest(req, res, 'notificationUrl'));
app.use('/whatsapp-signup', whatsappSignupRoutes);

// Start server
https.createServer(options, app).listen(port, () => {
  console.log(`HTTPS Server running on https://localhost:${port}`);
});