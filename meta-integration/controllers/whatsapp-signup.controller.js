// controllers/whatsapp-signup.controller.js
const FacebookSdkService = require('../services/facebook-sdk.service');
const fs = require('fs');
const path = require('path');

class WhatsappSignupController {
  constructor() {
    this.fbSdk = new FacebookSdkService();
    this.configId = process.env.FACEBOOK_CONFIG_ID || '1250989683096544';
  }

  async initialize() {
    try {
      await this.fbSdk.initialize();
    } catch (error) {
      console.error('Initialization error:', error);
      throw error;
    }
  }

  async getLoginUrl(redirectUri) {
    try {
      await this.initialize();
      return this.fbSdk.getLoginUrl(this.configId, redirectUri);
    } catch (error) {
      console.error('Error getting login URL:', error);
      throw error;
    }
  }

async handleCallback(code, redirectUri) {
  try {
    // Ensure output directory exists
    const outputDir = path.join(__dirname, '..', 'output');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Exchange the code for an access token
    const tokenData = await this.fbSdk.exchangeCodeForToken(code, redirectUri);
    
    // Prepare data to save
    const saveData = {
      timestamp: new Date().toISOString(),
      code,
      redirectUri,
      tokenData,
      success: true
    };

    // Write to file
    const filename = `facebook_token_${Date.now()}.json`;
    const filePath = path.join(outputDir, filename);
    
    fs.writeFileSync(
      filePath,
      JSON.stringify(saveData, null, 2),
      'utf8'
    );

    console.log(`Token data saved to ${filePath}`);
    
    return {
      success: true,
      accessToken: tokenData.access_token,
      expiresIn: tokenData.expires_in,
      filePath // Optional: return path for reference
    };
  } catch (error) {
    // Error logging
    const errorData = {
      timestamp: new Date().toISOString(),
      code,
      redirectUri,
      error: error.message,
      stack: error.stack,
      success: false
    };

    const errorFilename = `facebook_error_${Date.now()}.json`;
    const errorPath = path.join(__dirname, '..', 'output', errorFilename);
    
    fs.writeFileSync(
      errorPath,
      JSON.stringify(errorData, null, 2),
      'utf8'
    );

    console.error('Error handling callback:', error);
    return {
      success: false,
      error: error.message || 'Failed to handle Facebook callback',
      errorPath // Optional: return path for reference
    };
  }
}
}

module.exports = WhatsappSignupController;