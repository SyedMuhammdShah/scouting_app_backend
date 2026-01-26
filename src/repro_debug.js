const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

async function testJson() {
    console.log('--- Testing JSON Registration ---');
    try {
        const response = await axios.post('http://localhost:3000/api/auth/register', {
            "username": "HKHK",
            "email": "sm@gmail.com",
            "password": "StrongPassword123",
            "profile": "https://example.com/profile.jpg",
            "fullName": "Syed Muhammad Shah"
        });
        console.log('Success:', response.data);
    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
    }
}

async function testMultipart() {
    console.log('\n--- Testing Multipart Registration ---');
    try {
        const form = new FormData();
        form.append('username', 'HKHK_multi');
        form.append('email', 'sm_multi@gmail.com');
        form.append('password', 'StrongPassword123');
        form.append('fullName', 'Syed Muhammad Shah');
        // No file for now, just fields

        const response = await axios.post('http://localhost:3000/api/auth/register', form, {
            headers: form.getHeaders()
        });
        console.log('Success:', response.data);
    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
    }
}

testJson();
// testMultipart(); // Requires server to be running
