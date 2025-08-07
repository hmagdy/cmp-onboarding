const apiURL = "https://556885277c31.ngrok-free.app"

// Fill in your actual data here
const data = {
  partnerId: "PID-60b8c680784f9c00191397ed",
  channel: "whatsapp",

  customerId: "40-mazadak", // To be added from CMP database org ID ARB UCC
  metaAccountType: "customer",                 // or "partner" or customer

  redirectUrl: `${apiURL}/redirect`,
  notificationUrl: `${apiURL}/notification`,
  webhookUrl: `${apiURL}/webhook`,

};

const base64 = Buffer.from(JSON.stringify(data)).toString('base64');

const onboardingUrl = `https://partner.uib.ai/onboarding?token=${base64}`;

// console.log("Base64 Token:", base64);
console.log("Onboarding URL:", onboardingUrl);