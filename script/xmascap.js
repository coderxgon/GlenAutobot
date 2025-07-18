const axios = require('axios');

module.exports.config = {
  name: "zip",
  version: "1.0.0",
  role: 0,
  aliases: ["zip"],
  hasPrefix: false,
  description: "Get location details from a ZIP code",
  usage: "zipcode [country] [zipcode]",
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
      "❌ Usage: `zipcode [country code] [zipcode]`\nExample: `zipcode ph 4115`",
      threadID,
      messageID
    );
  }

  const apiUrl = `https://kaiz-apis.gleeze.com/api/zipcodeinfo?country=${encodeURIComponent(country)}&zipcode=${encodeURIComponent(zipcode)}&apikey=4fe7e522-70b7-420b-a746-d7a23db49ee5`;

  try {
    // Fetch location data
    const res = await axios.get(apiUrl);
    const data = res.data;

    // Handle errors in API response
    if (!data || data.status !== "success") {
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
    } = data;

    const result = `📮 Zip Code Info:
🔹 Country: ${country} (${country_code})
🔹 State: ${state || "N/A"}
🔹 City: ${city || "N/A"}
🔹 Region: ${region || "N/A"}
🔹 Area: ${area || "N/A"}
🔹 Zip Code: ${zipcode}`;

    api.sendMessage(result, threadID, messageID);

  } catch (err) {
    console.error("Zipcode API error:", err?.response?.data || err.message);
    api.sendMessage("❌ Failed to fetch ZIP code info. Please try again.", threadID, messageID);
  }
};