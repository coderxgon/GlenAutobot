const axios = require('axios');

module.exports.config = {
  name: "zip",
  version: "1.0.1",
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

  // Input validation
  const country = args[0]?.toLowerCase();
  const zipcode = args[1];

  if (!country || !zipcode) {
    console.log('[DEBUG] Missing args:', args);
    return api.sendMessage(
      "❌ Usage: zip [country code] [zipcode]\nExample: zip ph 4115",
      threadID,
      messageID
    );
  }

  const apiUrl = `https://kaiz-apis.gleeze.com/api/zipcodeinfo?country=${encodeURIComponent(country)}&zipcode=${encodeURIComponent(zipcode)}&apikey=4fe7e522-70b7-420b-a746-d7a23db49ee5`;
  console.log('[DEBUG] Requesting URL:', apiUrl);

  try {
    const res = await axios.get(apiUrl);
    console.log('[DEBUG] API Response status:', res.status);
    console.log('[DEBUG] API Response data:', res.data);

    const apiData = res.data;
    if (!apiData || apiData.status !== "success" || !apiData.data) {
      console.log('[DEBUG] Invalid API data:', apiData);
      return api.sendMessage("❌ ZIP code not found or invalid input.", threadID, messageID);
    }

    const {
      zipcode: zc,
      country: cn,
      country_code,
      state,
      city,
      region,
      area
    } = apiData.data;

    const result = `📮 ZIP Code Info:
🔹 Country: ${cn} (${country_code})
🔹 State: ${state || "N/A"}
🔹 City: ${city || "N/A"}
🔹 Region: ${region || "N/A"}
🔹 Area: ${area || "N/A"}
🔹 ZIP Code: ${zc}`;

    return api.sendMessage(result, threadID, messageID);

  } catch (err) {
    console.error("[ERROR] Zipcode API Error:", err);
    console.log('[DEBUG] err.response?.data:', err?.response?.data);
    return api.sendMessage(
      "❌ Failed to fetch ZIP code info. Check console for error.",
      threadID,
      messageID
    );
  }
};