import axios from 'axios';

class FacebookSdkService {
  constructor() {
    this.accessToken = null;
    this.appId = process.env.FACEBOOK_APP_ID || '722247330419486';
    this.appSecret = process.env.FACEBOOK_APP_SECRET || "35cee5c3a51a884a9128e9b917c71a0e";
    this.apiVersion = 'v19.0';
  }

  async initialize() {
    if (!this.appId || !this.appSecret) {
      throw new Error('Facebook App ID and Secret must be configured');
    }

    // In Node.js, we typically get an access token rather than loading the client-side SDK
    await this.getAppAccessToken();
  }

  async getAppAccessToken() {
    try {
      const response = await axios.get(
        `https://graph.facebook.com/${this.apiVersion}/oauth/access_token`,
        {
          params: {
            client_id: this.appId,
            client_secret: this.appSecret,
            grant_type: 'client_credentials'
          }
        }
      );

      this.accessToken = response.data.access_token;
      return this.accessToken;
    } catch (error) {
      console.error('Error getting Facebook app access token:', error.response?.data || error.message);
      throw new Error('Failed to get Facebook app access token');
    }
  }

  async getLoginUrl(configId, redirectUri, scopes = [
    'whatsapp_business_messaging',
    'whatsapp_business_management',
    'business_management'
]) {
    return `https://www.facebook.com/${this.apiVersion}/dialog/oauth?` +
      `client_id=${this.appId}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&config_id=${configId}` +
      `&response_type=code` +
      `&scope=${scopes.join(',')}`;
  }

  async exchangeCodeForToken(code, redirectUri) {
    try {
      const response = await axios.get(
        `https://graph.facebook.com/${this.apiVersion}/oauth/access_token`,
        {
          params: {
            client_id: this.appId,
            client_secret: this.appSecret,
            redirect_uri: redirectUri,
            code: code
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error exchanging code for token:', error.response?.data || error.message);
      throw new Error('Failed to exchange code for token');
    }
  }
}


export default FacebookSdkService;
