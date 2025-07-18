const axios = require('axios');

module.exports.config = {
  name: "zip",
  version: "1.0.0",
  role: 0,
  aliases: [],
  hasPrefix: false,
  description: "Get location details from a ZIP code",
  usage: "zip [country] [zipcode]",
  credits: "Vern",
  cooldown: 3
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID } = event;

  // Validate input
  const country = args[0]?.toLowerCase();
  const zipcode = args[1];

  if (!country || !zipcode) {
    return api.sendMessage(
      "❌ Usage: zip [country code] [zipcode]\nExample: zip ph 4115",
      threadID,
      messageID
    );
  }

  const apiUrl = `https://kaiz-apis.gleeze.com/api/zipcodeinfo?country=${encodeURIComponent(country)}&zipcode=${encodeURIComponent(zipcode)}&apikey=4fe7e522-70b7-420b-a746-d7a23db49ee5`;

  try {
    const res = await axios.get(apiUrl);
    const apiData = res.data;

    // Check if API response is valid
    if (!apiData || apiData.status !== "success" || !apiData.data) {
      return api.sendMessage("❌ ZIP code not found or invalid input.", threadID, messageID);
    }

    const {
      zipcode,
      country,
      country_code,
      state,
      city,
      region,
      area
    } = apiData.data;

    const result = `📮 ZIP Code Info:
🔹 Country: ${country} (${country_code})
🔹 State: ${state || "N/A"}
🔹 City: ${city || "N/A"}
🔹 Region: ${region || "N/A"}
🔹 Area: ${area || "N/A"}
🔹 ZIP Code: ${zipcode}`;

    api.sendMessage(result, threadID, messageID);

  } catch (err) {
    console.error("Zipcode API Error:", err?.response?.data || err.message);
    api.sendMessage("❌ Failed to fetch ZIP code info. Please try again later.", threadID, messageID);
  }
};