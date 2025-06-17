// routes/whatsapp-signup.routes.js
const express = require('express');
const router = express.Router();
const WhatsappSignupController = require('../controllers/whatsapp-signup.controller');

const controller = new WhatsappSignupController();

// Endpoint to get the Facebook login URL
router.get('/login-url', async (req, res) => {
  try {
    console.log('hi')
    const redirectUri = `${req.protocol}://${req.get('host')}/whatsapp-signup/callback`;
    const url = await controller.getLoginUrl(redirectUri);
    res.json({ url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Callback endpoint for Facebook to redirect to after login
router.get('/callback', async (req, res) => {
  try {
    const { code } = req.query;
    const redirectUri = `${req.protocol}://${req.get('host')}/whatsapp-signup/callback`;
    
    if (!code) {
      return res.status(400).json({ error: 'Authorization code is required' });
    }
    
    const result = await controller.handleCallback(code, redirectUri);
    
    if (result.success) {
      // Redirect to success page or send JSON response
      res.redirect('/home');
    } else {
      res.status(400).json({ error: result.error });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;