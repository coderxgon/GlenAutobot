const axios = require("axios");

module.exports.config = {
  name: "fbpost",
  version: "1.0.0",
  role: 0,
  aliases: ["fbpostgen", "facebookpost"],
  description: "Generate a Facebook post-style image with your message.",
  usage: "/fbpost <text>",
  cooldown: 3,
  credits: "Vern",
  commandCategory: "Canvas"
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID } = event;
  const text = args.join(" ").trim();

  if (!text) {
    return api.sendMessage(
      `📝 Please provide a message for the Facebook post.\n\n📌 Usage: /fbpost Hello World!`,
      threadID,
      messageID
    );
  }

  try {
    await api.sendMessage("⏳ Generating Facebook post image...", threadID, messageID);

    // Update this URL if you have a different endpoint
    const apiUrl = `https://vern-api.onrender.com/api/fbpost?text=${encodeURIComponent(text)}`;

    const response = await axios.get(apiUrl, { responseType: "stream" });

    return api.sendMessage({
      body: "✅ Facebook post image generated!",
      attachment: response.data
    }, threadID, messageID);

  } catch (err) {
    console.error("❌ API Error:", err?.response?.data || err.message);
    return api.sendMessage("❌ Failed to generate image. Please try again later.", threadID, messageID);
  }
};