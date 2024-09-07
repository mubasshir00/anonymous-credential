const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());
app.use(express.static('public'));

// Function to generate SHA-256 hash
function sha256Hash(data) {
    return crypto.createHash('sha256').update(data).digest('hex');
}

// API endpoint to create anonymous credential
app.post('/api/generate-credential', (req, res) => {
    const { patientId, hospitalId, serviceToken } = req.body;

    if (!patientId || !hospitalId || !serviceToken) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    // Hashing the individual components
    const patientIdHash = sha256Hash(patientId);
    const hospitalIdHash = sha256Hash(hospitalId);
    const serviceTokenHash = sha256Hash(serviceToken);
    const timestampHash = sha256Hash(Date.now());

    // Creating the combined credential ID
    const credentialId = sha256Hash(patientIdHash + hospitalIdHash + serviceTokenHash + timestampHash);

    // Building the anonymous credential response
    const anonymousCredential = {
        patient_id_hash: patientIdHash,
        hospital_id_hash: hospitalIdHash,
        service_token_hash: serviceTokenHash,
        timestamp_hash: timestampHash,
        credential_id: credentialId
    };

    // Send the anonymous credential as the response
    res.json(anonymousCredential);
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
