const apiURL = "https://394e-197-135-80-208.ngrok-free.app"

// Fill in your actual data here
const data = {
  partnerId: "PID-60b8c680784f9c00191397ed",
  channel: "whatsapp",

  // peak
  // customerId: "123456-peaktime", // To be added from CMP database org ID
  // mediaUrl: "https://peaktime.app/wp-content/uploads/2024/05/Peak-logo.png", // optional


  customerId: "12-alrajhi-arb-ucc", // To be added from CMP database org ID ARB UCC

  mediaUrl: "https://uib-partner-portal.s3.eu-central-1.amazonaws.com/4e7ec10c-5e19-4cdd-bd12-2bc0d61aa5fa/1744720449996", // optional

  metaAccountType: "customer",                 // or "partner" or customer

  // node server.js
  redirectUrl: `${apiURL}/redirect`,
  webhookUrl: `${apiURL}/webhook`,
  notificationUrl: `${apiURL}/notification`,

// about: "Business Description",                // optional
// dataLocalizationRegion: "SG",                // optional
//   webhookHeaders: {
//     "Authorization": "Bearer xyz",
//     "type": "message"
//   },

//   notificationHeaders: {
//     "Authorization": "Bearer xyz",
//     "type": "notify"
//   }
};

const base64 = Buffer.from(JSON.stringify(data)).toString('base64');

const onboardingUrl = `https://partner.uib.ai/onboarding?token=${base64}`;

// console.log("Base64 Token:", base64);
console.log("Onboarding URL:", onboardingUrl);