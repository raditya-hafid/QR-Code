const express = require('express');
const qrcode = require('qrcode');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Set EJS as the template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware to parse URL-encoded bodies (form data)
app.use(express.urlencoded({ extended: true }));
// Serve static files from the public folder
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
    res.render('index', { qrCodeData: null, error: null, text: '' });
});

app.post('/generate', async (req, res) => {
    const text = req.body.text;

    if (!text) {
        return res.render('index', { qrCodeData: null, error: 'Silakan masukkan teks atau URL!', text: '' });
    }

    try {
        // Generate QR Code as a Data URL (Base64)
        const qrCodeData = await qrcode.toDataURL(text, {
            errorCorrectionLevel: 'H',
            margin: 2,
            width: 300,
            color: {
                dark: '#000000',
                light: '#ffffff'
            }
        });

        res.render('index', { qrCodeData, error: null, text });
    } catch (err) {
        console.error('Error generating QR Code:', err);
        res.render('index', { qrCodeData: null, error: 'Gagal membuat QR Code.', text });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
