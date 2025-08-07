import FacebookSdkServiceModule from './lib/sdk.js';
const FacebookSdkService = FacebookSdkServiceModule.default || FacebookSdkServiceModule;


const apiURL = "https://556885277c31.ngrok-free.app"
const redirectUri = `${apiURL}/redirect`;

const sdk = new FacebookSdkService();

const configId = '1250989683096544';

const url = await sdk.getLoginUrl(configId, redirectUri);

console.log("Onboarding URL:", url);